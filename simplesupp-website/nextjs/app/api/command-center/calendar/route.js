import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET — fetch all calendar events
export async function GET() {
  const { data, error } = await supabase
    .from('captain_calendar')
    .select('*')
    .order('date_key', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group by date_key
  const grouped = {};
  for (const ev of data) {
    if (!grouped[ev.date_key]) grouped[ev.date_key] = [];
    grouped[ev.date_key].push(ev);
  }
  return NextResponse.json({ events: grouped });
}

// POST — add a new event
export async function POST(request) {
  const { date_key, title, start_time, duration, location } = await request.json();
  if (!date_key || !title) return NextResponse.json({ error: 'date_key and title required' }, { status: 400 });

  const id = 'manual_' + Date.now();
  const { error } = await supabase.from('captain_calendar').insert({
    id, date_key, title, start_time: start_time || '12:00 PM',
    duration: duration || '1h', location, source: 'manual',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id });
}

// DELETE — remove an event
export async function DELETE(request) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase.from('captain_calendar').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
