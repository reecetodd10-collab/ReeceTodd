import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createOpenAIClient, SYSTEM_PROMPTS } from '@/lib/openai';

export async function POST(request) {
  try {
    const { userId } = await auth();
    
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

    const openai = createOpenAIClient();

    // Build context from user profile if available
    let contextPrompt = SYSTEM_PROMPTS.chat;
    if (userProfile) {
      contextPrompt += `\n\nUser Profile Context:
- Goals: ${userProfile.goals || 'Not specified'}
- Experience Level: ${userProfile.experienceLevel || 'Not specified'}
- Current Supplements: ${userProfile.currentSupplements || 'None'}
- Workout Frequency: ${userProfile.workoutFrequency || 'Not specified'}
- Diet Type: ${userProfile.dietType || 'Not specified'}

Use this context to provide more personalized advice.`;
    }

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: contextPrompt
      }
    ];

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.8,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

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

