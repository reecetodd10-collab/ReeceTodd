# OpenAI GPT-3.5-Turbo Integration Guide

This guide covers the OpenAI integration for Aviera's AI-powered features.

## Environment Setup

The OpenAI API key has been added to `.env.local`:

```env
OPENAI_API_KEY=sk-proj-...
```

## API Routes

### 1. `/api/ai/supplement-recommendation`

**Purpose:** Generate personalized supplement stacks using GPT-3.5-Turbo

**Request Body:**
```json
{
  "primaryGoal": "muscle",
  "formData": {
    "age": "25",
    "gender": "male",
    "weight": "180",
    "height": "72",
    "trainingExperience": "Intermediate",
    "dietType": "omnivore",
    "healthGoals": ["Build Muscle", "Increase Strength"],
    ...
  }
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": {
    "supplements": [
      {
        "name": "Creatine Monohydrate",
        "dosage": "5g daily",
        "timing": "Post-workout",
        "reason": "Gold standard for strength gains",
        "priority": "Essential"
      }
    ],
    "summary": "Overall explanation...",
    "insights": ["Key insight 1", "Key insight 2"]
  }
}
```

### 2. `/api/ai/workout-plan`

**Purpose:** Generate personalized workout plans

**Request Body:**
```json
{
  "goals": "Muscle Building",
  "experienceLevel": "Intermediate",
  "equipmentAvailable": "Full gym access",
  "daysPerWeek": 4,
  "workoutDuration": "60 minutes",
  "preferences": "Focus on compound movements"
}
```

**Response:**
```json
{
  "success": true,
  "workoutPlan": {
    "planName": "AI-Generated Workout Plan",
    "duration": "8 weeks",
    "daysPerWeek": 4,
    "workouts": [
      {
        "day": "Monday",
        "focus": "Upper Body",
        "exercises": [
          {
            "name": "Bench Press",
            "sets": 4,
            "reps": "6-8",
            "rest": "2-3 minutes",
            "notes": "Focus on form"
          }
        ]
      }
    ]
  }
}
```

### 3. `/api/ai/chat`

**Purpose:** General fitness/nutrition chat assistant

**Request Body:**
```json
{
  "message": "What's the best time to take creatine?",
  "conversationHistory": [
    { "sender": "user", "text": "Previous message" },
    { "sender": "ai", "text": "Previous response" }
  ],
  "userProfile": {
    "currentSupplements": "Creatine, Protein",
    "workoutFrequency": "4 times per week"
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "The best time to take creatine is post-workout..."
}
```

## System Prompts

All system prompts are defined in `lib/openai.js`:

- **supplementRecommendation**: Expert fitness/nutrition advisor with safety focus
- **workoutPlan**: Expert fitness coach with program design expertise
- **chat**: Friendly fitness assistant with context awareness

## Integration Points

### 1. Supplement Stack Builder

**Location:** `app/components/SupplementQuiz.jsx`

**Features:**
- Toggle between standard and AI recommendations
- "Use AI-Powered Recommendations" checkbox
- Calls `/api/ai/supplement-recommendation`
- Displays AI badge on generated stacks
- Shows AI summary and insights

**Usage:**
1. Complete quiz steps
2. Check "Use AI-Powered Recommendations"
3. Click "Generate AI Stack"
4. Review personalized recommendations

### 2. Workout Planner

**Location:** `app/dashboard/fit/page.js`

**Features:**
- "Generate AI Workout Plan" button in Quick Actions
- Modal to configure workout parameters
- Calls `/api/ai/workout-plan`
- Converts AI response to workout format
- Adds new week with AI-generated plan

**Usage:**
1. Click "Generate AI Workout Plan"
2. Fill in goals, experience, equipment, etc.
3. Click "Generate Plan"
4. Review and customize the generated plan

### 3. AI Chat Widget

**Location:** `app/components/premium/AIChat.jsx`

**Features:**
- Floating chat button in dashboard
- Real-time conversation with GPT-3.5-Turbo
- Context-aware (uses user profile from localStorage)
- Conversation history maintained
- Premium feature (gated)

**Usage:**
1. Click chat button in dashboard
2. Ask fitness/nutrition questions
3. AI responds with personalized advice
4. Conversation history saved in localStorage

## Testing

### Test Supplement Recommendations

1. Go to `/smartstack-ai`
2. Complete quiz
3. Enable "Use AI-Powered Recommendations"
4. Generate stack
5. Verify AI recommendations appear

### Test Workout Plan

1. Go to `/dashboard/fit`
2. Click "Generate AI Workout Plan"
3. Fill in parameters
4. Generate plan
5. Verify workouts appear in calendar

### Test AI Chat

1. Go to `/dashboard`
2. Click chat button (bottom right)
3. Ask: "What supplements should I take for muscle building?"
4. Verify AI response

## Error Handling

All API routes include:
- Authentication checks (Clerk)
- Input validation
- Error logging
- Graceful fallbacks
- User-friendly error messages

## Cost Considerations

- GPT-3.5-Turbo is cost-effective (~$0.0015 per 1K tokens)
- Supplement recommendations: ~500-800 tokens
- Workout plans: ~1000-1500 tokens
- Chat messages: ~200-500 tokens per exchange

**Estimated costs:**
- 100 supplement recommendations: ~$0.10
- 100 workout plans: ~$0.20
- 1000 chat messages: ~$0.50

## Security

- API key stored in `.env.local` (never commit)
- All routes require Clerk authentication
- User data sanitized before sending to OpenAI
- No sensitive data sent to AI (only fitness goals/profile)

## Next Steps

1. **Monitor Usage:** Track API calls and costs
2. **Improve Prompts:** Refine system prompts based on user feedback
3. **Add Caching:** Cache common recommendations to reduce API calls
4. **Rate Limiting:** Add rate limits to prevent abuse
5. **Analytics:** Track which AI features are most used

## Troubleshooting

### API Key Not Working
- Verify key is in `.env.local`
- Check key starts with `sk-proj-` or `sk-`
- Restart dev server after adding key

### Slow Responses
- GPT-3.5-Turbo typically responds in 1-3 seconds
- Check network connection
- Verify OpenAI service status

### Invalid Responses
- AI may return non-JSON sometimes
- Fallback parsing handles this
- Check console for raw responses

### Authentication Errors
- Ensure user is signed in with Clerk
- Check middleware is protecting routes

