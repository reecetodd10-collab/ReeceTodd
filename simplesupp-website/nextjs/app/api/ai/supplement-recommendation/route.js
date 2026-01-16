import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// System prompt for supplement recommendations
const SYSTEM_PROMPT = `You are an expert fitness and nutrition advisor specializing in evidence-based supplement recommendations. Your role is to analyze user profiles and provide personalized supplement stacks.

Guidelines:
- Only recommend supplements with strong scientific backing
- Consider user goals, experience level, dietary restrictions, and health conditions
- Provide clear explanations for each recommendation
- Include dosage and timing recommendations
- Prioritize safety and avoid interactions
- Be honest about limitations and when supplements may not be necessary
- Format responses as JSON with supplements array and explanations

Safety Disclaimer: Always remind users to consult with healthcare providers before starting new supplements, especially if they have medical conditions or take medications.`;

export async function POST(request) {
  console.log('=== AI SUPPLEMENT RECOMMENDATION API CALLED ===');
  
  // Check environment variables first
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('OPENAI_API_KEY exists:', !!apiKey);
  console.log('OPENAI_API_KEY length:', apiKey ? apiKey.length : 0);
  console.log('OPENAI_API_KEY starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');

  if (!apiKey) {
    console.error('ERROR: OPENAI_API_KEY is not set in environment variables');
    return NextResponse.json(
      { 
        error: 'OpenAI API key not configured',
        details: 'OPENAI_API_KEY environment variable is missing'
      },
      { status: 500 }
    );
  }

  try {
    // Parse request body
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2).substring(0, 500));
    
    const { primaryGoal, formData, quizResults } = body;

    if (!primaryGoal || !formData) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: primaryGoal and formData' },
        { status: 400 }
      );
    }

    console.log('Creating OpenAI client...');
    
    // Create OpenAI client directly (inline to avoid import issues)
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('OpenAI client created successfully');

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

    console.log('Calling OpenAI API...');
    
    // Call OpenAI with try-catch for specific error handling
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-5.1',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });
      console.log('OpenAI API call successful');
    } catch (openaiError) {
      console.error('=== OPENAI API ERROR ===');
      console.error('Error name:', openaiError.name);
      console.error('Error message:', openaiError.message);
      console.error('Error status:', openaiError.status);
      console.error('Error code:', openaiError.code);
      console.error('Full error:', JSON.stringify(openaiError, null, 2));
      
      return NextResponse.json(
        { 
          error: 'OpenAI API call failed',
          details: openaiError.message,
          code: openaiError.code || openaiError.status || 'UNKNOWN'
        },
        { status: 500 }
      );
    }

    const aiResponse = completion.choices[0]?.message?.content || '';
    console.log('AI Response length:', aiResponse.length);
    console.log('AI Response preview:', aiResponse.substring(0, 200));
    
    // Try to parse and format the response
    let formattedResponse;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        formattedResponse = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed JSON response');
      } else {
        console.log('No JSON found in response, using fallback format');
        formattedResponse = {
          supplements: [],
          summary: aiResponse,
          insights: ['AI generated recommendation - see summary for details']
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError.message);
      formattedResponse = {
        supplements: [],
        summary: aiResponse,
        insights: ['AI generated recommendation - see summary for details']
      };
    }

    console.log('=== AI RECOMMENDATION SUCCESS ===');
    return NextResponse.json({
      success: true,
      recommendations: formattedResponse,
      rawResponse: aiResponse
    });

  } catch (error) {
    console.error('=== GENERAL API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        details: error.message,
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
}
