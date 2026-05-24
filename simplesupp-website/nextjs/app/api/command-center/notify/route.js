import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    // Dynamic import to avoid ESM/CJS issues
    const webpush = (await import('web-push')).default;

    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublic || !vapidPrivate) {
      console.error('Missing VAPID keys:', { vapidPublic: !!vapidPublic, vapidPrivate: !!vapidPrivate });
      return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
    }

    webpush.setVapidDetails(
      'mailto:reecetodd10@gmail.com',
      vapidPublic,
      vapidPrivate
    );

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { title, body, tag, url } = await request.json();

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
    }

    if (!subscriptions?.length) {
      return NextResponse.json({ error: 'No subscriptions found. Enable notifications in Captain Seat first.' }, { status: 404 });
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
          keys: typeof sub.keys === 'string' ? JSON.parse(sub.keys) : sub.keys,
        }, payload).catch(async (err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
          }
          throw err;
        })
      )
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      console.error('Push failures:', failed.map(f => f.reason?.message || f.reason));
    }

    return NextResponse.json({ success: true, sent, total: subscriptions.length });
  } catch (err) {
    console.error('Notify error:', err?.message || err);
    return NextResponse.json({ error: 'Server error', details: err?.message }, { status: 500 });
  }
}
