import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuthUser, createSupabaseAdmin } from '../../../lib/supabase-server';

// System prompt specifically for the quiz chat widget
const QUIZ_CHAT_SYSTEM_PROMPT = `You are Aviera AI, a knowledgeable and friendly supplement advisor helping users understand their personalized supplement recommendations.

You have access to the user's:
- Fitness goal
- Recommended supplement stack
- Profile information (age, activity level, diet, etc.)
- Previous orders and purchase history
- Quiz results and preferences

Your role:
1. Explain WHY specific supplements were recommended for their goals
2. Provide guidance on HOW and WHEN to take each supplement
3. Answer questions about supplement interactions, timing, and stacking
4. Suggest additional products that might help their specific goals
5. Provide evidence-based information about supplement benefits
6. Help users navigate the site and find products they need
7. Be proactive in suggesting supplements based on their goals and history

Guidelines:
- Be conversational, friendly, and encouraging
- Keep responses concise (2-4 sentences unless detailed explanation needed)
- Reference their specific goal and supplements when relevant
- Use emojis sparingly to keep it engaging ✨
- Always be honest about limitations and when to consult professionals
- If asked about medical conditions, recommend consulting a healthcare provider
- Proactively suggest relevant supplements when appropriate
- Remember their past orders and preferences

You know about these Aviera supplement categories:
- Performance: Creatine, Whey Protein, Pre-Workout, BCAAs, Electrolytes
- Weight Management: Fat Burner with MCT, Keto BHB, Keto-5
- Health & Wellness: Omega-3, Multivitamin, CoQ10, Turmeric, Probiotics
- Recovery & Sleep: Magnesium Glycinate, Sleep Support, Ashwagandha
- Focus & Cognition: Lion's Mane, Alpha Energy, Flow State Nootropic
- Beauty: Collagen Peptides, Hyaluronic Acid Serum

Remember: You're a helpful personal fitness advisor. Be supportive and help them feel confident about their choices!`;

export async function POST(request) {
  // Check environment variables first
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: OPENAI_API_KEY is not set');
    return NextResponse.json(
      {
        error: 'AI service not configured',
        fallbackResponse: "I'm having trouble connecting right now. Please try again in a moment, or browse our shop for more information about our supplements!"
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      userContext = {}
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get authenticated user from Supabase
    const authUser = await getAuthUser(request);
    const userId = authUser?.id;

    // Initialize Supabase admin client
    const supabase = createSupabaseAdmin();

    // Build enriched context from auth + Supabase
    let contextPrompt = QUIZ_CHAT_SYSTEM_PROMPT;

    // If user is authenticated, fetch their data
    if (userId) {
      try {
        // Look up internal DB user for streak info
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, current_streak, longest_streak, last_intake_date')
          .eq('auth_user_id', userId)
          .single();

        const internalUserId = dbUser?.id;

        // Run all queries in parallel
        const [quizRes, stacksRes, intakeRes, optimizationRes, ordersRes] = await Promise.all([
          // Latest 3 quiz responses
          internalUserId
            ? supabase
                .from('quiz_responses')
                .select('goals, experience_level, age_range, gender, workout_frequency, diet_type, sleep_quality, stress_level, current_supplements, recommended_stack, created_at')
                .eq('user_id', internalUserId)
                .order('created_at', { ascending: false })
                .limit(3)
            : Promise.resolve({ data: [] }),

          // Current supplement stacks
          internalUserId
            ? supabase
                .from('supplement_stacks')
                .select('name, supplements, created_at')
                .eq('user_id', internalUserId)
                .order('created_at', { ascending: false })
                .limit(5)
            : Promise.resolve({ data: [] }),

          // Intake logs from last 30 days
          internalUserId
            ? supabase
                .from('intake_logs')
                .select('supplement_name, created_at')
                .eq('user_id', internalUserId)
                .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
                .order('created_at', { ascending: false })
            : Promise.resolve({ data: [] }),

          // Latest optimization score (uses auth_user_id)
          supabase
            .from('supplement_optimization_results')
            .select('optimization_score, primary_goal, primary_bottleneck, scores, created_at')
            .eq('auth_user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),

          // Fetch user's orders (if table exists)
          supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        const quizData = quizRes.data || [];
        const latestQuiz = quizData[0];

        // Summarize intake logs by supplement frequency
        const intakeSummary = {};
        if (intakeRes.data) {
          intakeRes.data.forEach(log => {
            intakeSummary[log.supplement_name] = (intakeSummary[log.supplement_name] || 0) + 1;
          });
        }

        contextPrompt += `\n\n=== AUTHENTICATED USER DATA ===
User ID: ${userId}

Quiz Results:
${latestQuiz ? `
- Goals: ${JSON.stringify(latestQuiz.goals) || 'Not specified'}
- Age Range: ${latestQuiz.age_range || 'Not specified'}
- Gender: ${latestQuiz.gender || 'Not specified'}
- Experience Level: ${latestQuiz.experience_level || 'Not specified'}
- Workout Frequency: ${latestQuiz.workout_frequency || 'Not specified'}
- Diet Type: ${latestQuiz.diet_type || 'Not specified'}
- Sleep Quality: ${latestQuiz.sleep_quality || 'Not specified'}
- Stress Level: ${latestQuiz.stress_level || 'Not specified'}
- Current Supplements: ${JSON.stringify(latestQuiz.current_supplements) || 'None'}
- AI Recommended Stack: ${JSON.stringify(latestQuiz.recommended_stack) || 'Not specified'}
` : 'No quiz results found - suggest they take the quiz!'}`;

        // Supplement stacks
        if (stacksRes.data && stacksRes.data.length > 0) {
          contextPrompt += `\nCurrent Supplement Stacks:`;
          stacksRes.data.forEach(stack => {
            contextPrompt += `\n- ${stack.name}: ${JSON.stringify(stack.supplements)}`;
          });
        }

        // Intake frequency
        const intakeEntries = Object.entries(intakeSummary);
        if (intakeEntries.length > 0) {
          contextPrompt += `\n\nSupplement Intake (last 30 days):`;
          intakeEntries.forEach(([name, count]) => {
            contextPrompt += `\n- ${name}: ${count} time(s)`;
          });
        }

        // Optimization score
        if (optimizationRes.data) {
          const opt = optimizationRes.data;
          contextPrompt += `\n\nSupplement Optimization Score:
- Score: ${opt.optimization_score}/100
- Primary Goal: ${opt.primary_goal || 'Not specified'}
- Primary Bottleneck: ${opt.primary_bottleneck || 'None identified'}
- Sub-scores: ${JSON.stringify(opt.scores) || 'N/A'}`;
        }

        // Streak info
        if (dbUser) {
          contextPrompt += `\n\nAdherence & Streak:
- Current streak: ${dbUser.current_streak || 0} day(s)
- Longest streak: ${dbUser.longest_streak || 0} day(s)
- Last intake logged: ${dbUser.last_intake_date || 'Never'}`;
        }

        // Purchase history
        const orders = ordersRes.data;
        contextPrompt += `\n\nPurchase History:
${orders && orders.length > 0 ? orders.map(order => `- ${order.product_name} (${new Date(order.created_at).toLocaleDateString()})`).join('\n') : 'No previous orders'}

Use this data to provide highly personalized recommendations. Reference their specific supplements, goals, streak, and optimization score when relevant.`;

      } catch (dbError) {
        console.error('Error fetching user data:', dbError);
        // Continue without user data if fetch fails
      }
    }

    // Also include any context passed from the frontend (for backwards compatibility)
    if (userContext && Object.keys(userContext).length > 0) {
      const { primaryGoal, goalTitle, recommendedStack, formData } = userContext;

      contextPrompt += `\n\n=== CURRENT SESSION CONTEXT ===
Primary Goal: ${goalTitle || primaryGoal || 'Not specified'}

Their Recommended Stack:
${recommendedStack?.map((s, i) => `${i + 1}. ${s.name} - ${s.reason || 'Personalized recommendation'}`).join('\n') || 'No stack yet'}

Session Profile:
- Age: ${formData?.age || 'Not specified'}
- Gender: ${formData?.gender || 'Not specified'}
- Activity Level: ${formData?.activityLevel || 'Not specified'}
- Workout Frequency: ${formData?.workoutFrequency || 'Not specified'}
- Diet Type: ${formData?.dietType || 'Not specified'}
- Sleep: ${formData?.sleepHours || 'Not specified'} hours
- Stress Level: ${formData?.stressLevel || 'Not specified'}
- Biggest Challenge: ${formData?.biggestChallenge || 'Not specified'}
- Health Goals: ${formData?.healthGoals?.join(', ') || 'Not specified'}`;
    }

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: contextPrompt
      }
    ];

    // Add conversation history (last 8 messages for context)
    const recentHistory = conversationHistory.slice(-8);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    // Call OpenAI with GPT-5.1 and newsletter settings
    const completion = await openai.chat.completions.create({
      model: 'gpt-5.1',
      messages: messages,
      temperature: 0.8,
      max_completion_tokens: 4000, // Same as newsletter
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error('Error in quiz chat:', error);

    // Provide a helpful fallback response
    return NextResponse.json(
      {
        error: 'Failed to get AI response',
        fallbackResponse: "I'm having a moment! 😅 While I get back on track, feel free to explore our shop or check out the 'Why This Stack Works' section above for more details about your supplements.",
        details: error.message
      },
      { status: 500 }
    );
  }
}

