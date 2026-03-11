import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createSupabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

// Called daily by Vercel Cron — sends restock reminders for purchases older than restock_reminder_days
export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdmin();

    // Find purchases that are due for restock (purchased_at + restock_reminder_days <= today)
    const { data: purchases, error } = await supabase
      .rpc('get_restock_reminders');

    // If the RPC doesn't exist yet, use a direct query
    let restockItems = purchases;
    if (error) {
      const cutoff = new Date(Date.now() - 25 * 86400000).toISOString();
      const { data, error: queryError } = await supabase
        .from('purchase_history')
        .select('*, users!inner(email)')
        .lte('purchased_at', cutoff)
        .order('purchased_at', { ascending: true });

      if (queryError) throw queryError;
      restockItems = data;
    }

    // Group by user email
    const byUser = {};
    for (const item of (restockItems || [])) {
      const email = item.users?.email;
      if (!email) continue;
      if (!byUser[email]) byUser[email] = [];
      byUser[email].push(item);
    }

    let sent = 0;
    for (const [email, items] of Object.entries(byUser)) {
      const productList = items
        .map(i => `<li style="color:#888;font-size:12px;padding:4px 0;">${i.product_name}</li>`)
        .join('');

      try {
        await resend.emails.send({
          from: 'Aviera <info@avierafit.com>',
          to: email,
          subject: '🔄 Time to restock? Your supplements may be running low.',
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
  <tr><td style="background:#0a0a0a;border:1px solid rgba(168,85,247,0.2);border-radius:8px;padding:32px 24px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">🔄</div>
    <h1 style="margin:0 0 8px;color:#fff;font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:-0.02em;">
      TIME TO RESTOCK
    </h1>
    <p style="margin:0 0 20px;color:#666;font-size:12px;line-height:1.6;">
      It's been about a month since your last purchase. Running low?
    </p>
    <div style="text-align:left;background:rgba(168,85,247,0.05);border:1px solid rgba(168,85,247,0.15);border-radius:4px;padding:16px;margin-bottom:24px;">
      <span style="color:#a855f7;font-size:9px;text-transform:uppercase;letter-spacing:0.15em;display:block;margin-bottom:8px;">Your last order included:</span>
      <ul style="margin:0;padding:0 0 0 16px;">${productList}</ul>
    </div>
    <a href="https://avierafit.com/shop" style="display:inline-block;padding:16px 40px;background:#00ffcc;color:#000;font-size:14px;font-weight:700;text-decoration:none;border-radius:4px;text-transform:uppercase;letter-spacing:0.15em;">
      Shop Now →
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
        console.error(`Failed to send restock reminder to ${email}:`, emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      usersFound: Object.keys(byUser).length,
      emailsSent: sent,
    });
  } catch (error) {
    console.error('Restock reminder cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
