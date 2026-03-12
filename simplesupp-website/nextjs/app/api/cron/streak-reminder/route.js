import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import webpush from 'web-push';
import { createSupabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

// Configure web push with VAPID keys
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:info@avierafit.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Called daily by Vercel Cron — sends streak reminders to users who haven't logged today
export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const today = new Date().toISOString().split('T')[0];

    // Find users with active streaks (>=2 days) who haven't logged today
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, current_streak, longest_streak, last_intake_date')
      .gte('current_streak', 2)
      .neq('last_intake_date', today)
      .not('email', 'is', null);

    if (error) throw error;

    // ─── Send Web Push Notifications ───
    let pushSent = 0;
    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      const userIds = (users || []).map((u) => u.id);
      if (userIds.length > 0) {
        const { data: pushSubs } = await supabase
          .from('push_subscriptions')
          .select('*')
          .in('user_id', userIds);

        const staleEndpoints = [];
        for (const sub of pushSubs || []) {
          const matchedUser = users.find((u) => u.id === sub.user_id);
          if (!matchedUser) continue;

          const payload = JSON.stringify({
            title: "\uD83D\uDD25 Don't break your streak!",
            body: `You're on a ${matchedUser.current_streak}-day streak. Log your supplements now.`,
            url: '/dashboard',
            icon: '/Aviera_Final_Transparent.png',
          });

          try {
            await webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
              },
              payload
            );
            pushSent++;
          } catch (pushErr) {
            if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
              staleEndpoints.push(sub.endpoint);
            }
            console.error(`Push failed for endpoint:`, pushErr.statusCode || pushErr.message);
          }
        }

        // Clean up stale subscriptions
        if (staleEndpoints.length > 0) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .in('endpoint', staleEndpoints);
        }
      }
    }

    // ─── Send Email Notifications ───
    let sent = 0;
    for (const user of (users || [])) {
      if (!user.email) continue;

      try {
        await resend.emails.send({
          from: 'Aviera <info@avierafit.com>',
          to: user.email,
          subject: `🔥 ${user.current_streak}-day streak! Don't break it.`,
          html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;">
<tr><td style="padding:40px 20px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:430px;margin:0 auto;">
  <tr><td style="text-align:center;padding-bottom:24px;">
    <span style="font-size:12px;font-weight:700;letter-spacing:0.4em;color:#00ffcc;text-transform:uppercase;">◉ Aviera</span>
  </td></tr>
  <tr><td style="background:#0a0a0a;border:1px solid rgba(0,255,204,0.2);border-radius:8px;padding:32px 24px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">🔥</div>
    <h1 style="margin:0 0 8px;color:#fff;font-size:28px;font-weight:700;text-transform:uppercase;letter-spacing:-0.02em;">
      ${user.current_streak}-DAY STREAK
    </h1>
    <p style="margin:0 0 24px;color:#666;font-size:12px;line-height:1.6;">
      Stay optimized. Log your supplements today to keep your streak alive.
    </p>
    <div style="background:rgba(0,255,204,0.1);border:1px solid rgba(0,255,204,0.15);border-radius:4px;padding:12px;margin-bottom:24px;">
      <span style="color:#00ffcc;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">
        Best streak: ${user.longest_streak} days
      </span>
    </div>
    <a href="https://avierafit.com/dashboard" style="display:inline-block;padding:16px 40px;background:#00ffcc;color:#000;font-size:14px;font-weight:700;text-decoration:none;border-radius:4px;text-transform:uppercase;letter-spacing:0.15em;">
      Log Now →
    </a>
  </td></tr>
  <tr><td style="text-align:center;padding-top:24px;">
    <p style="margin:0;color:#333;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;">
      Aviera Fit · San Diego, CA
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`,
        });
        sent++;
      } catch (emailErr) {
        console.error(`Failed to send streak reminder to ${user.email}:`, emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      usersFound: users?.length || 0,
      emailsSent: sent,
      pushSent,
    });
  } catch (error) {
    console.error('Streak reminder cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
