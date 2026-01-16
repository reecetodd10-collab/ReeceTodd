import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClaudeClient, SYSTEM_PROMPTS } from '@/lib/claude';

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

