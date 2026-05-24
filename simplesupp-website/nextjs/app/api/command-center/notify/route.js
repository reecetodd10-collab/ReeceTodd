import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

webpush.setVapidDetails(
  'mailto:reecetodd10@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(request) {
  try {
    const { title, body, tag, url } = await request.json();

    // Get all push subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error || !subscriptions?.length) {
      return NextResponse.json({ error: 'No subscriptions found' }, { status: 404 });
    }

    const payload = JSON.stringify({
      title: title || "Captain Seat",
      body: body || "You have a new update.",
      icon: '/captain-wheel.svg',
      tag: tag || 'captain-update',
      url: url || '/command-center',
    });

    const results = await Promise.allSettled(
      subscriptions.map(sub =>
        webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: sub.keys,
        }, payload).catch(async (err) => {
          // Remove expired subscriptions
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
          }
          throw err;
        })
      )
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    return NextResponse.json({ success: true, sent });
  } catch (err) {
    console.error('Notify error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
