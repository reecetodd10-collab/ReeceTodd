import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are an expert fitness and nutrition analyst for Aviera, a premium supplement company. Generate personalized insights based on the user's optimization quiz results.

TONE: Analytical, confident, coach-like. Think WHOOP meets Huberman Lab - performance-focused, not bro-science.

You will return a JSON object with the following structure:
{
  "overallAssessment": "above" | "average" | "below",
  "biggestStrength": {
    "category": "string",
    "text": "1 sentence about their biggest strength"
  },
  "primaryGap": {
    "category": "string",
    "text": "1 sentence about their primary gap"
  },
  "keyOpportunity": "1 sentence about what improving their gap could unlock",
  "productReasons": [
    "Personalized reason for product 1 based on their specific scores",
    "Personalized reason for product 2 based on their specific scores"
  ],
  "specialPick": {
    "productKeyword": "keyword to search for the special product (e.g., 'vitamin d', 'zinc', 'collagen', 'greens')",
    "reasoning": "2 sentences explaining why this unique supplement would benefit THIS specific user"
  },
  "insights": [
    "Insight 1 connecting their data to outcomes",
    "Insight 2 with actionable advice",
    "Insight 3 forward-looking"
  ]
}

RULES:
- Be specific to their data points - reference actual scores
- Connect metrics to outcomes (e.g., "Your sleep score of 2/5 indicates reduced testosterone and growth hormone production")
- Frame gaps as opportunities, not failures
- For specialPick, choose a supplement NOT already recommended that would uniquely benefit them
- specialPick should be different from the main recommendations - think zinc, vitamin d, collagen, greens, probiotics, etc.
- Make product reasons SPECIFIC to their profile, not generic
- Keep all text concise but impactful`;

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

    const { responses, scores, recommendations, shopifyProducts } = await request.json();

    if (!responses || !scores) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    // Population averages for comparison
    const populationAverages = {
      sleep: 15,
      energy: 12,
      stress: 12,
      goalAlignment: 12,
      trainingLoad: 8,
      total: 60,
    };

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
- Total Optimization Score: ${scores.total}/100 (${(scores.total / 10).toFixed(1)}/10)
- Sleep Score: ${scores.sleep}/25 (Population avg: ${populationAverages.sleep}/25)
- Energy Score: ${scores.energy}/20 (Population avg: ${populationAverages.energy}/20)
- Stress Score: ${scores.stress}/20 (Population avg: ${populationAverages.stress}/20)
- Goal Alignment: ${scores.goalAlignment}/20 (Population avg: ${populationAverages.goalAlignment}/20)
- Training Load: ${scores.trainingLoad}/15 (Population avg: ${populationAverages.trainingLoad}/15)

ALREADY RECOMMENDED PRODUCTS: ${recommendations?.join(', ') || 'None yet'}

AVAILABLE PRODUCTS FOR SPECIAL PICK: ${shopifyProducts?.map(p => p.title).join(', ') || 'Various supplements'}

Generate comprehensive personalized insights. For specialPick, choose a product keyword that matches something NOT in the already recommended list. Return as valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContext },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // Parse JSON response
    let insights = null;
    try {
      insights = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Error parsing AI insights:', parseError);
      // Generate fallback insights
      insights = generateFallbackInsights(responses, scores, recommendations);
    }

    // Ensure all required fields exist
    if (!insights.overallAssessment) {
      insights.overallAssessment = scores.total >= 75 ? 'above' : scores.total >= 50 ? 'average' : 'below';
    }

    if (!insights.biggestStrength) {
      insights.biggestStrength = {
        category: 'Training',
        text: `Your training consistency with ${responses.trainingFrequency} frequency shows strong commitment to your goals.`,
      };
    }

    if (!insights.primaryGap) {
      insights.primaryGap = {
        category: 'Recovery',
        text: `Your sleep quality of ${responses.sleepQuality}/5 indicates room for recovery optimization.`,
      };
    }

    if (!insights.keyOpportunity) {
      insights.keyOpportunity = `Improving your primary gap could boost your score by an estimated ${Math.min(2.5, (5 - Math.min(responses.sleepQuality, responses.energyLevel)) * 0.5).toFixed(1)} points.`;
    }

    if (!insights.specialPick) {
      // Generate a special pick based on what's not recommended
      insights.specialPick = generateSpecialPick(responses, scores, recommendations);
    }

    if (!insights.insights || insights.insights.length === 0) {
      insights.insights = [
        `Your sleep quality score of ${responses.sleepQuality}/5 indicates room for recovery optimization.`,
        `With ${responses.trainingFrequency} training, your supplement timing should align with recovery windows.`,
        `Focus on addressing your primary gap to unlock ${100 - scores.total}% more potential.`,
      ];
    }

    return NextResponse.json({
      success: true,
      insights: insights,
      specialPick: insights.specialPick,
      productReasons: insights.productReasons || [],
    });

  } catch (error) {
    console.error('Error generating optimization insights:', error);

    // Return fallback insights instead of error
    let responses, scores, recommendations;
    try {
      const body = await request.clone().json();
      responses = body.responses || {};
      scores = body.scores || {};
      recommendations = body.recommendations || [];
    } catch {
      responses = {};
      scores = { total: 60, sleep: 15, energy: 12, stress: 12, goalAlignment: 12, trainingLoad: 8 };
      recommendations = [];
    }

    const fallbackInsights = generateFallbackInsights(responses, scores, recommendations);

    return NextResponse.json({
      success: true,
      insights: fallbackInsights,
      specialPick: fallbackInsights.specialPick,
      productReasons: fallbackInsights.productReasons || [],
    });
  }
}

// Generate fallback insights when AI fails
function generateFallbackInsights(responses, scores, recommendations) {
  const sleepQuality = responses.sleepQuality || 3;
  const energyLevel = responses.energyLevel || 3;
  const stressLevel = responses.stressLevel || 3;
  const trainingFrequency = responses.trainingFrequency || '3-4 days/week';
  const totalScore = scores.total || 60;

  // Determine overall assessment
  const overallAssessment = totalScore >= 75 ? 'above' : totalScore >= 50 ? 'average' : 'below';

  // Find biggest strength
  const categories = [
    { name: 'training consistency', score: scores.trainingLoad || 8, max: 15 },
    { name: 'goal alignment', score: scores.goalAlignment || 12, max: 20 },
    { name: 'stress management', score: scores.stress || 12, max: 20 },
    { name: 'energy levels', score: scores.energy || 12, max: 20 },
    { name: 'sleep quality', score: scores.sleep || 15, max: 25 },
  ];

  const best = categories.reduce((max, cat) =>
    (cat.score / cat.max) > (max.score / max.max) ? cat : max
  );

  const worst = categories.reduce((min, cat) =>
    (cat.score / cat.max) < (min.score / min.max) ? cat : min
  );

  return {
    overallAssessment,
    biggestStrength: {
      category: best.name,
      text: `Your ${best.name} is your biggest asset, keeping you ahead of the curve.`,
    },
    primaryGap: {
      category: worst.name,
      text: `${worst.name.charAt(0).toUpperCase() + worst.name.slice(1)} is limiting your recovery potential and overall adaptation.`,
    },
    keyOpportunity: `Improving ${worst.name} could boost your score by an estimated ${Math.min(2.5, (worst.max - worst.score) / worst.max * 2.5).toFixed(1)} points.`,
    productReasons: [
      `Based on your profile with ${trainingFrequency} training frequency, this supplement directly addresses your optimization needs.`,
      `With your current health metrics, this will help fill nutritional gaps and support your ${responses.primaryGoal || 'fitness'} goal.`,
    ],
    specialPick: generateSpecialPick(responses, scores, recommendations),
    insights: [
      sleepQuality <= 2
        ? `Your sleep quality score of ${sleepQuality}/5 indicates significant room for recovery optimization. Poor sleep directly impacts hormone production, muscle repair, and next-day performance.`
        : sleepQuality >= 4
          ? `Your sleep quality of ${sleepQuality}/5 provides a strong foundation for recovery. This positions you well to maximize training adaptations.`
          : `Your sleep quality score of ${sleepQuality}/5 suggests moderate recovery capacity. Improving this metric would compound benefits across all other areas.`,

      stressLevel >= 4
        ? `Elevated stress levels (${stressLevel}/5) create a catabolic environment that impairs muscle growth and fat loss. Addressing cortisol management should be a priority.`
        : energyLevel <= 2
          ? `Low daytime energy (${energyLevel}/5) often indicates metabolic inefficiency or nutrient gaps. Strategic supplementation can help restore optimal energy production.`
          : `With ${trainingFrequency} training frequency, timing your supplements around your workout windows will maximize absorption and effectiveness.`,

      `For ${responses.primaryGoal || 'your goals'}, you have ${100 - totalScore}% untapped optimization potential. Addressing your primary gap first will create the fastest path to results.`,
    ],
  };
}

// Generate a special pick recommendation
function generateSpecialPick(responses, scores, recommendations) {
  const recommendedLower = (recommendations || []).map(r => r.toLowerCase());
  const sleepQuality = responses.sleepQuality || 3;
  const stressLevel = responses.stressLevel || 3;
  const energyLevel = responses.energyLevel || 3;
  const age = responses.age || '25-34';
  const trainingStyle = responses.trainingStyle || 'General Fitness';

  // Priority-based special picks
  const specialPicks = [
    {
      condition: stressLevel >= 3 && !recommendedLower.some(r => r.includes('magnesium')),
      productKeyword: 'magnesium',
      reasoning: `Based on your stress level of ${stressLevel}/5, magnesium glycinate supports nervous system relaxation and can improve both stress resilience and sleep quality - a compound benefit for your profile.`,
    },
    {
      condition: !recommendedLower.some(r => r.includes('vitamin d') || r.includes('d3')),
      productKeyword: 'vitamin d',
      reasoning: `Vitamin D is critical for athletic performance and immune function. With ${responses.trainingFrequency || 'regular'} training, optimal D3 levels support testosterone production and muscle recovery.`,
    },
    {
      condition: trainingStyle === 'Weightlifting/Strength' && !recommendedLower.some(r => r.includes('collagen')),
      productKeyword: 'collagen',
      reasoning: `For strength athletes, collagen peptides support joint health and connective tissue repair. This becomes increasingly important with your training intensity and will help prevent overuse injuries.`,
    },
    {
      condition: age === '35-44' || age === '45-54' || age === '55+',
      productKeyword: 'zinc',
      reasoning: `Zinc is essential for testosterone production and immune function, both of which become more critical as we age. Your age bracket benefits significantly from optimal zinc levels.`,
    },
    {
      condition: responses.digestiveIssues === true,
      productKeyword: 'probiotic',
      reasoning: `Given your digestive concerns, a quality probiotic can improve nutrient absorption from your other supplements and support gut-immune axis function for better recovery.`,
    },
    {
      condition: energyLevel <= 3,
      productKeyword: 'b complex',
      reasoning: `B vitamins are essential cofactors in energy metabolism. With your energy score of ${energyLevel}/5, a quality B-complex can help optimize cellular energy production throughout the day.`,
    },
  ];

  // Find first matching special pick
  for (const pick of specialPicks) {
    if (pick.condition) {
      return {
        productKeyword: pick.productKeyword,
        reasoning: pick.reasoning,
      };
    }
  }

  // Default special pick
  return {
    productKeyword: 'vitamin d',
    reasoning: `Vitamin D optimization is one of the highest-impact, lowest-cost interventions for athletic performance. Most athletes are deficient, and optimal levels support muscle function, bone health, and immune resilience.`,
  };
}
