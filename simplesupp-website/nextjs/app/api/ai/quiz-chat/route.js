import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

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

    // Get authenticated user from Clerk
    const { userId } = await auth();

    // Initialize Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Build enriched context from Clerk + Supabase
    let contextPrompt = QUIZ_CHAT_SYSTEM_PROMPT;

    // If user is authenticated, fetch their data
    if (userId) {
      try {
        // Fetch user's quiz results
        const { data: quizResults } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Fetch user's orders (if you have an orders table)
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        contextPrompt += `\n\n=== AUTHENTICATED USER DATA ===
User ID: ${userId}

Quiz Results:
${quizResults ? `
- Primary Goal: ${quizResults.primary_goal || 'Not specified'}
- Age: ${quizResults.age || 'Not specified'}
- Gender: ${quizResults.gender || 'Not specified'}
- Activity Level: ${quizResults.activity_level || 'Not specified'}
- Workout Frequency: ${quizResults.workout_frequency || 'Not specified'}
- Diet Type: ${quizResults.diet_type || 'Not specified'}
- Sleep: ${quizResults.sleep_hours || 'Not specified'} hours
- Stress Level: ${quizResults.stress_level || 'Not specified'}
- Biggest Challenge: ${quizResults.biggest_challenge || 'Not specified'}
- Recommended Stack: ${JSON.stringify(quizResults.recommended_stack) || 'Not specified'}
` : 'No quiz results found - suggest they take the quiz!'}

Purchase History:
${orders && orders.length > 0 ? orders.map(order => `- ${order.product_name} (${new Date(order.created_at).toLocaleDateString()})`).join('\n') : 'No previous orders'}

Use this data to provide highly personalized recommendations.`;

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

