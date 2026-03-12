import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createSupabaseAdmin } from '../../../lib/supabase-server';

webpush.setVapidDetails(
  'mailto:info@avierafit.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// POST - Send push notifications
// Secured with CRON_SECRET
export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId, title, body, url, icon } = await request.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'title and body are required' }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    // Get subscriptions — specific user or all users
    let query = supabase.from('push_subscriptions').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: subscriptions, error } = await query;
    if (error) throw error;

    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      icon: icon || '/Aviera_Final_Transparent.png',
    });

    let sent = 0;
    let failed = 0;
    const staleEndpoints = [];

    for (const sub of subscriptions || []) {
      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys_p256dh,
          auth: sub.keys_auth,
        },
      };

      try {
        await webpush.sendNotification(pushSub, payload);
        sent++;
      } catch (err) {
        failed++;
        // If subscription is expired/invalid (410 Gone or 404), mark for cleanup
        if (err.statusCode === 410 || err.statusCode === 404) {
          staleEndpoints.push(sub.endpoint);
        }
        console.error(`Push failed for ${sub.endpoint}:`, err.statusCode || err.message);
      }
    }

    // Clean up stale subscriptions
    if (staleEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', staleEndpoints);
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      cleaned: staleEndpoints.length,
    });
  } catch (error) {
    console.error('Push send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
