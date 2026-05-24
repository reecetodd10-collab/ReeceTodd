import { NextResponse } from 'next/server';

// This endpoint serves as a proxy marker — actual calendar data
// is fetched via Claude's MCP tools and injected client-side
export async function GET() {
  return NextResponse.json({
    message: 'Calendar data is fetched via Claude Code session',
    instructions: 'Use the command input to ask Claude to check your calendar'
  });
}
