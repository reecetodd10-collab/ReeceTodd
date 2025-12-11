import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// System prompt specifically for the quiz chat widget
const QUIZ_CHAT_SYSTEM_PROMPT = `You are Aviera AI, a knowledgeable and friendly supplement advisor helping users understand their personalized supplement recommendations.

You have access to the user's:
- Fitness goal
- Recommended supplement stack
- Profile information (age, activity level, diet, etc.)

Your role:
1. Explain WHY specific supplements were recommended for their goals
2. Provide guidance on HOW and WHEN to take each supplement
3. Answer questions about supplement interactions, timing, and stacking
4. Suggest additional products that might help their specific goals
5. Provide evidence-based information about supplement benefits

Guidelines:
- Be conversational, friendly, and encouraging
- Keep responses concise (2-4 sentences unless detailed explanation needed)
- Reference their specific goal and supplements when relevant
- Use emojis sparingly to keep it engaging ✨
- Always be honest about limitations and when to consult professionals
- If asked about medical conditions, recommend consulting a healthcare provider

You know about these Aviera supplement categories:
- Performance: Creatine, Whey Protein, Pre-Workout, BCAAs, Electrolytes
- Weight Management: Fat Burner with MCT, Keto BHB, Keto-5
- Health & Wellness: Omega-3, Multivitamin, CoQ10, Turmeric, Probiotics
- Recovery & Sleep: Magnesium Glycinate, Sleep Support, Ashwagandha
- Focus & Cognition: Lion's Mane, Alpha Energy, Flow State Nootropic
- Beauty: Collagen Peptides, Hyaluronic Acid Serum

Remember: You're helping someone who just received their personalized supplement stack. Be supportive and help them feel confident about their choices!`;

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

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Build context from user's quiz results
    let contextPrompt = QUIZ_CHAT_SYSTEM_PROMPT;
    
    if (userContext) {
      const { primaryGoal, goalTitle, recommendedStack, formData } = userContext;
      
      contextPrompt += `\n\n=== USER CONTEXT ===
Primary Goal: ${goalTitle || primaryGoal || 'Not specified'}

Their Recommended Stack:
${recommendedStack?.map((s, i) => `${i + 1}. ${s.name} - ${s.reason || 'Personalized recommendation'}`).join('\n') || 'No stack yet'}

User Profile:
- Age: ${formData?.age || 'Not specified'}
- Gender: ${formData?.gender || 'Not specified'}
- Activity Level: ${formData?.activityLevel || 'Not specified'}
- Workout Frequency: ${formData?.workoutFrequency || 'Not specified'}
- Diet Type: ${formData?.dietType || 'Not specified'}
- Sleep: ${formData?.sleepHours || 'Not specified'} hours
- Stress Level: ${formData?.stressLevel || 'Not specified'}
- Biggest Challenge: ${formData?.biggestChallenge || 'Not specified'}
- Health Goals: ${formData?.healthGoals?.join(', ') || 'Not specified'}

Use this context to provide personalized, relevant responses.`;
    }

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

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.8,
      max_tokens: 400,
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

