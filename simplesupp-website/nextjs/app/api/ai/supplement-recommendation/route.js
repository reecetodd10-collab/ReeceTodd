import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createOpenAIClient, SYSTEM_PROMPTS, formatSupplementResponse } from '@/lib/openai';

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
      primaryGoal,
      formData,
      quizResults 
    } = body;

    if (!primaryGoal || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields: primaryGoal and formData' },
        { status: 400 }
      );
    }

    const openai = createOpenAIClient();

    // Build user profile context
    const userProfile = `
User Profile:
- Primary Goal: ${primaryGoal}
- Age: ${formData.age || 'Not specified'}
- Gender: ${formData.gender || 'Not specified'}
- Weight: ${formData.weight || 'Not specified'} lbs
- Height: ${formData.height || 'Not specified'} inches
- Training Experience: ${formData.trainingExperience || 'Not specified'}
- Activity Level: ${formData.activityLevel || 'Not specified'}
- Workout Frequency: ${formData.workoutFrequency || 'Not specified'} times per week
- Diet Type: ${formData.dietType || 'Not specified'}
- Sleep Hours: ${formData.sleepHours || 'Not specified'} hours per night
- Stress Level: ${formData.stressLevel || 'Not specified'}
- Energy Level: ${formData.energyLevel || 'Not specified'}
- Health Goals: ${formData.healthGoals?.join(', ') || 'None specified'}
- Health Conditions: ${formData.conditions?.join(', ') || 'None'}
- Biggest Challenge: ${formData.biggestChallenge || 'Not specified'}
`;

    const userPrompt = `${userProfile}

Based on this profile, recommend a personalized supplement stack. Format your response as JSON with this structure:
{
  "supplements": [
    {
      "name": "Supplement Name",
      "dosage": "Recommended dosage",
      "timing": "When to take (e.g., morning, pre-workout, post-workout)",
      "reason": "Why this supplement is recommended for this user",
      "priority": "Essential" or "High" or "Medium"
    }
  ],
  "summary": "Overall explanation of the stack and how it supports the user's goals",
  "insights": ["Key insight 1", "Key insight 2", "Key insight 3"]
}

Focus on supplements that are:
1. Scientifically proven for the user's goals
2. Safe given their health profile
3. Appropriate for their experience level
4. Compatible with their diet type

Keep the stack focused (3-7 supplements max) and prioritize the most impactful ones.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.supplementRecommendation
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';
    
    // Try to parse and format the response
    let formattedResponse;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        formattedResponse = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if JSON parsing fails
        formattedResponse = formatSupplementResponse(aiResponse);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      formattedResponse = formatSupplementResponse(aiResponse);
    }

    return NextResponse.json({
      success: true,
      recommendations: formattedResponse,
      rawResponse: aiResponse
    });

  } catch (error) {
    console.error('Error generating supplement recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

