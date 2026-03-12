import { NextResponse } from 'next/server';
import { getAuthUser, createSupabaseAdmin } from '../../../lib/supabase-server';
import { createClaudeClient, SYSTEM_PROMPTS } from '@/lib/claude';

// Fetch user history data from Supabase for personalized AI context
async function fetchUserHistory(userId) {
  const supabase = createSupabaseAdmin();

  // First, look up the internal DB user by auth user id
  const { data: dbUser } = await supabase
    .from('users')
    .select('id, current_streak, longest_streak, last_intake_date')
    .eq('auth_user_id', userId)
    .single();

  if (!dbUser) return null;

  const internalUserId = dbUser.id;

  // Run all queries in parallel
  const [quizRes, stacksRes, intakeRes, optimizationRes] = await Promise.all([
    // Latest 3 quiz responses
    supabase
      .from('quiz_responses')
      .select('goals, experience_level, workout_frequency, diet_type, sleep_quality, stress_level, current_supplements, recommended_stack, created_at')
      .eq('user_id', internalUserId)
      .order('created_at', { ascending: false })
      .limit(3),

    // Current supplement stacks
    supabase
      .from('supplement_stacks')
      .select('name, supplements, created_at')
      .eq('user_id', internalUserId)
      .order('created_at', { ascending: false })
      .limit(5),

    // Intake logs from last 30 days (supplement names + frequency)
    supabase
      .from('intake_logs')
      .select('supplement_name, created_at')
      .eq('user_id', internalUserId)
      .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
      .order('created_at', { ascending: false }),

    // Latest optimization score
    supabase
      .from('supplement_optimization_results')
      .select('optimization_score, primary_goal, primary_bottleneck, scores, created_at')
      .eq('auth_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
  ]);

  // Summarize intake logs by supplement frequency
  const intakeSummary = {};
  if (intakeRes.data) {
    intakeRes.data.forEach(log => {
      intakeSummary[log.supplement_name] = (intakeSummary[log.supplement_name] || 0) + 1;
    });
  }

  return {
    streak: {
      current: dbUser.current_streak || 0,
      longest: dbUser.longest_streak || 0,
      lastIntake: dbUser.last_intake_date,
    },
    quizResponses: quizRes.data || [],
    stacks: stacksRes.data || [],
    intakeSummary,
    intakeLogCount: intakeRes.data?.length || 0,
    optimization: optimizationRes.data || null,
  };
}

// Build a context string from user history
function buildUserContextPrompt(history) {
  if (!history) return '';

  let context = '\n\n=== PERSONALIZED USER CONTEXT (from their account data) ===';

  // Streak info
  context += `\n\nAdherence & Streak:
- Current streak: ${history.streak.current} day(s)
- Longest streak: ${history.streak.longest} day(s)
- Last intake logged: ${history.streak.lastIntake || 'Never'}`;

  // Supplement stacks
  if (history.stacks.length > 0) {
    context += '\n\nCurrent Supplement Stacks:';
    history.stacks.forEach(stack => {
      context += `\n- ${stack.name}: ${JSON.stringify(stack.supplements)}`;
    });
  }

  // Intake frequency (last 30 days)
  const intakeEntries = Object.entries(history.intakeSummary);
  if (intakeEntries.length > 0) {
    context += '\n\nSupplement Intake (last 30 days):';
    intakeEntries.forEach(([name, count]) => {
      context += `\n- ${name}: ${count} time(s)`;
    });
  }

  // Quiz responses
  if (history.quizResponses.length > 0) {
    const latest = history.quizResponses[0];
    context += `\n\nLatest Quiz Results:
- Goals: ${JSON.stringify(latest.goals) || 'Not specified'}
- Experience Level: ${latest.experience_level || 'Not specified'}
- Workout Frequency: ${latest.workout_frequency || 'Not specified'}
- Diet Type: ${latest.diet_type || 'Not specified'}
- Sleep Quality: ${latest.sleep_quality || 'Not specified'}
- Stress Level: ${latest.stress_level || 'Not specified'}
- Current Supplements: ${JSON.stringify(latest.current_supplements) || 'None'}
- AI Recommended Stack: ${JSON.stringify(latest.recommended_stack) || 'None'}`;
  }

  // Optimization score
  if (history.optimization) {
    const opt = history.optimization;
    context += `\n\nSupplement Optimization Score:
- Score: ${opt.optimization_score}/100
- Primary Goal: ${opt.primary_goal || 'Not specified'}
- Primary Bottleneck: ${opt.primary_bottleneck || 'None identified'}
- Sub-scores: ${JSON.stringify(opt.scores) || 'N/A'}`;
  }

  context += '\n\nUse this data to give highly personalized advice. Reference specific supplements they take, their goals, streak, and optimization score when relevant.';

  return context;
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      userProfile = null
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const anthropic = createClaudeClient();

    // Build context from user profile if available
    let systemPrompt = SYSTEM_PROMPTS.chat;
    if (userProfile) {
      systemPrompt += `\n\nUser Profile Context:
- Goals: ${userProfile.goals || 'Not specified'}
- Experience Level: ${userProfile.experienceLevel || 'Not specified'}
- Current Supplements: ${userProfile.currentSupplements || 'None'}
- Workout Frequency: ${userProfile.workoutFrequency || 'Not specified'}
- Diet Type: ${userProfile.dietType || 'Not specified'}

Use this context to provide more personalized advice.`;
    }

    // Fetch and inject user history from Supabase
    try {
      const userHistory = await fetchUserHistory(userId);
      if (userHistory) {
        systemPrompt += buildUserContextPrompt(userHistory);
      }
    } catch (historyError) {
      console.error('Error fetching user history for AI context:', historyError);
      // Continue without history - AI still works, just less personalized
    }

    // Build conversation messages for Claude
    const messages = [];

    // Add conversation history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    const completion = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      temperature: 0.8,
      system: systemPrompt,
      messages: messages,
    });

    const aiResponse = completion.content[0]?.text || '';

    return NextResponse.json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get AI response',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

