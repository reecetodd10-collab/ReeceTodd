import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are an expert fitness and nutrition analyst. Generate 3 concise, personalized insights based on the user's optimization quiz results.

TONE: Analytical, confident, coach-like. Think WHOOP meets Huberman Lab - performance-focused, not bro-science.

FORMAT: Return exactly 3 insights as a JSON array of strings. Each insight should be 1-2 sentences, connecting the user's data to actionable performance outcomes.

RULES:
- Be specific to their data points
- Connect metrics to outcomes (e.g., "Your sleep score of 2/5 indicates reduced testosterone and growth hormone production during recovery")
- Frame gaps as opportunities, not failures
- Reference their primary goal when relevant
- Keep insights actionable and forward-looking`;

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const { responses, scores, recommendations } = await request.json();

    if (!responses || !scores) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const userContext = `
USER QUIZ RESULTS:

Demographics:
- Age: ${responses.age}
- Gender: ${responses.gender}
- Height: ${responses.height}
- Weight: ${responses.weight}

Primary Goal: ${responses.primaryGoal}

Health Metrics (1-5 scale):
- Sleep Quality: ${responses.sleepQuality}/5
- Energy Level: ${responses.energyLevel}/5
- Stress Level: ${responses.stressLevel}/5
- Digestive Issues: ${responses.digestiveIssues ? 'Yes' : 'No'}

Training Profile:
- Training Frequency: ${responses.trainingFrequency}
- Training Style: ${responses.trainingStyle}
- Years Training: ${responses.yearsTraining}
- Injury History: ${responses.injuryHistory ? 'Yes' : 'No'}

Current Supplements: ${responses.currentSupplements?.join(', ') || 'None'}

CALCULATED SCORES:
- Total Optimization Score: ${scores.total}/100
- Sleep Score: ${scores.sleep}/25
- Energy Score: ${scores.energy}/20
- Stress Score: ${scores.stress}/20
- Goal Alignment: ${scores.goalAlignment}/20
- Training Load: ${scores.trainingLoad}/15

Recommended Products: ${recommendations?.join(', ') || 'None yet'}

Generate 3 personalized insights based on this data. Return as a JSON array of 3 strings.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContext },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // Parse JSON response
    let insights = [];
    try {
      // Try to extract JSON array from response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines and clean
        insights = aiResponse
          .split('\n')
          .filter(line => line.trim().length > 20)
          .slice(0, 3)
          .map(line => line.replace(/^[\d\.\-\*]\s*/, '').trim());
      }
    } catch (parseError) {
      console.error('Error parsing AI insights:', parseError);
      // Generate fallback insights based on scores
      insights = generateFallbackInsights(responses, scores);
    }

    // Ensure we have exactly 3 insights
    while (insights.length < 3) {
      insights.push(generateFallbackInsights(responses, scores)[insights.length] || 'Focus on consistency to optimize your results.');
    }

    return NextResponse.json({
      success: true,
      insights: insights.slice(0, 3),
    });

  } catch (error) {
    console.error('Error generating optimization insights:', error);

    // Return fallback insights instead of error
    const { responses, scores } = await request.json().catch(() => ({}));
    const fallbackInsights = generateFallbackInsights(responses || {}, scores || {});

    return NextResponse.json({
      success: true,
      insights: fallbackInsights,
    });
  }
}

// Generate fallback insights when AI fails
function generateFallbackInsights(responses, scores) {
  const insights = [];

  // Sleep insight
  if (responses.sleepQuality <= 2) {
    insights.push(`Your sleep quality score of ${responses.sleepQuality}/5 indicates significant room for recovery optimization. Poor sleep directly impacts hormone production, muscle repair, and next-day performance.`);
  } else if (responses.sleepQuality >= 4) {
    insights.push(`Your sleep quality of ${responses.sleepQuality}/5 provides a strong foundation for recovery. This positions you well to maximize training adaptations.`);
  } else {
    insights.push(`Your sleep quality score of ${responses.sleepQuality}/5 suggests moderate recovery capacity. Improving this metric would compound benefits across all other areas.`);
  }

  // Stress/Energy insight
  if (responses.stressLevel >= 4) {
    insights.push(`Elevated stress levels (${responses.stressLevel}/5) create a catabolic environment that impairs muscle growth and fat loss. Addressing cortisol management should be a priority.`);
  } else if (responses.energyLevel <= 2) {
    insights.push(`Low daytime energy (${responses.energyLevel}/5) often indicates metabolic inefficiency or nutrient gaps. Strategic supplementation can help restore optimal energy production.`);
  } else {
    insights.push(`With ${responses.trainingFrequency} training frequency, timing your supplements around your workout windows will maximize absorption and effectiveness.`);
  }

  // Goal-specific insight
  const goal = responses.primaryGoal || 'your goals';
  const potential = 100 - (scores.total || 60);
  insights.push(`For ${goal}, you have ${potential}% untapped optimization potential. Addressing your primary gap first will create the fastest path to results.`);

  return insights;
}
