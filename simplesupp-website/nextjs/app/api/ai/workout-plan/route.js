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
      goals,
      experienceLevel,
      equipmentAvailable,
      daysPerWeek,
      workoutDuration,
      preferences
    } = body;

    if (!goals || !experienceLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: goals and experienceLevel' },
        { status: 400 }
      );
    }

    const openai = createOpenAIClient();

    const userPrompt = `Create a personalized workout plan with the following parameters:

Goals: ${goals}
Experience Level: ${experienceLevel}
Equipment Available: ${equipmentAvailable || 'Full gym access'}
Days Per Week: ${daysPerWeek || '4'}
Workout Duration: ${workoutDuration || '60 minutes'}
Preferences: ${preferences || 'None specified'}

Format your response as JSON with this structure:
{
  "planName": "Name of the workout plan",
  "duration": "Total program duration (e.g., '8 weeks')",
  "daysPerWeek": ${daysPerWeek || 4},
  "workouts": [
    {
      "day": "Monday",
      "focus": "Muscle group or training focus",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "8-12",
          "rest": "60-90 seconds",
          "notes": "Form cues or tips"
        }
      ],
      "warmup": ["Warm-up exercise 1", "Warm-up exercise 2"],
      "cooldown": ["Cool-down exercise 1", "Cool-down exercise 2"]
    }
  ],
  "progression": "How to progress over time",
  "notes": "Additional important notes about the program"
}

Make the plan:
1. Appropriate for the experience level
2. Progressive (increases difficulty over time)
3. Balanced (hits all major muscle groups appropriately)
4. Realistic for the available time and equipment
5. Safe and sustainable`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-5.1',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.workoutPlan
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';
    
    // Try to parse JSON response
    let workoutPlan;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        workoutPlan = JSON.parse(jsonMatch[0]);
      } else {
        workoutPlan = {
          planName: 'AI-Generated Workout Plan',
          workouts: [],
          notes: aiResponse
        };
      }
    } catch (parseError) {
      console.error('Error parsing workout plan:', parseError);
      workoutPlan = {
        planName: 'AI-Generated Workout Plan',
        workouts: [],
        notes: aiResponse
      };
    }

    return NextResponse.json({
      success: true,
      workoutPlan: workoutPlan,
      rawResponse: aiResponse
    });

  } catch (error) {
    console.error('Error generating workout plan:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate workout plan',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

