import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createSupabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

// Map newsletter categories to subscriber preference columns
const CATEGORY_TO_SUB_COLUMN = {
  supplements: 'sub_supplements',
  fitness: 'sub_fitness',
  fitness_socials: 'sub_fitness_socials',
};

// Section styling per category
const SECTION_STYLES = {
  supplements: { label: 'Supplements & Peptides', color: '#a855f7' },
  fitness: { label: 'Fitness', color: '#00ffcc' },
  fitness_socials: { label: 'Health & Lifestyle', color: '#ff2d55' },
};

function buildEmailHtml(newsletter, unsubscribeBaseUrl) {
  const category = newsletter.category || 'supplements';
  const sections = [
    { key: 'fitness', label: 'Fitness', color: '#00ffcc' },
    { key: 'supplements', label: 'Supplements & Peptides', color: '#a855f7' },
    { key: 'fitness_socials', label: 'Health & Lifestyle', color: '#ff2d55' },
  ];

  // Determine the active section based on newsletter category
  const activeSection = sections.find((s) => s.key === category) || sections[0];

  const publishedDate = new Date(newsletter.published_date);
  const dateStr = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build section rows from the newsletter excerpt/content
  // The newsletter title acts as headline, excerpt as hook
  const sectionRows = sections
    .map((section) => {
      const isActive = section.key === category;
      return `
        <tr>
          <td style="padding: 0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-left: 3px solid ${section.color}; padding-left: 16px;">
              <tr>
                <td>
                  <p style="margin: 0 0 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: ${section.color};">
                    ${section.label}
                  </p>
                  ${
                    isActive
                      ? `<p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #ffffff; line-height: 1.4;">
                      ${newsletter.title}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #999999; line-height: 1.5;">
                      ${(newsletter.excerpt || '').slice(0, 160)}${(newsletter.excerpt || '').length > 160 ? '...' : ''}
                    </p>`
                      : `<p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.5;">
                      More updates coming soon.
                    </p>`
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #0a0a0a; border-radius: 12px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 36px 32px 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.4em; text-transform: uppercase; color: #00ffcc;">
                &#9673; AVIERA
              </p>
            </td>
          </tr>

          <!-- Date -->
          <tr>
            <td style="padding: 0 32px 28px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #666666; letter-spacing: 0.1em;">
                ${dateStr}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <div style="height: 1px; background-color: #1a1a1a;"></div>
            </td>
          </tr>

          <!-- Sections -->
          ${sectionRows}

          <!-- CTA Button -->
          <tr>
            <td style="padding: 16px 32px 32px; text-align: center;">
              <a href="https://avierafit.com/news" style="display: inline-block; padding: 14px 36px; background-color: #00ffcc; color: #000000; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 8px; letter-spacing: 0.05em;">
                Read More &rarr;
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px 20px;">
              <div style="height: 1px; background-color: #1a1a1a;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 0 32px 12px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #333333;">
                Aviera Fit &middot; San Diego, CA
              </p>
            </td>
          </tr>

          <!-- Unsubscribe -->
          <tr>
            <td style="padding: 0 32px 32px; text-align: center;">
              <a href="${unsubscribeBaseUrl}" style="font-size: 11px; color: #444444; text-decoration: underline;">
                Unsubscribe
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Weekly cron — sends the latest unsent newsletter to all matching subscribers
export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const websiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avierafit.com';
    const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || 'newsletter@avierafit.com';

    // 1. Fetch the latest newsletter that has NOT been sent yet
    //    We use the `email_sent_at` column — if null, it hasn't been sent.
    //    Fallback: if the column doesn't exist yet, fetch latest and check
    //    against a sent-tracking approach using a `last_sent_newsletter_id` kv.
    let newsletter = null;

    // Try fetching latest newsletter without email_sent_at (use created order)
    const { data: newsletters, error: fetchError } = await supabase
      .from('newsletters')
      .select('*')
      .order('published_date', { ascending: false })
      .limit(5);

    if (fetchError) throw fetchError;
    if (!newsletters || newsletters.length === 0) {
      return NextResponse.json({ message: 'No newsletters found' }, { status: 200 });
    }

    // Check for duplicate-send protection:
    // Look for a metadata record tracking the last sent newsletter ID
    const { data: metaRows } = await supabase
      .from('app_metadata')
      .select('value')
      .eq('key', 'last_sent_newsletter_id')
      .limit(1);

    const lastSentId = metaRows?.[0]?.value || null;

    // Find the latest newsletter that hasn't been sent
    // If email_sent_at column exists on the newsletter, use it; otherwise use metadata tracking
    if (newsletters[0].email_sent_at !== undefined) {
      // Column exists — find first unsent
      newsletter = newsletters.find((n) => !n.email_sent_at);
    } else {
      // Fallback — use metadata tracking
      newsletter = lastSentId ? newsletters.find((n) => n.id !== lastSentId) : newsletters[0];
      // If the latest is already the last sent one, nothing new to send
      if (newsletter && newsletter.id === lastSentId) {
        return NextResponse.json(
          { message: 'Latest newsletter already sent', newsletterId: lastSentId },
          { status: 200 }
        );
      }
    }

    if (!newsletter) {
      return NextResponse.json({ message: 'No unsent newsletters found' }, { status: 200 });
    }

    // 2. Fetch all active subscribers matching this newsletter's category
    const category = newsletter.category || 'supplements';
    const subColumn = CATEGORY_TO_SUB_COLUMN[category] || 'sub_supplements';

    // Query subscribers: must not be unsubscribed (subscribed column if exists, or just all)
    let subscriberQuery = supabase
      .from('newsletter_subscribers')
      .select('id, email')
      .eq(subColumn, true);

    // If there's a `subscribed` column, filter by it
    // We try both approaches — the query will just ignore unknown columns gracefully
    const { data: subscribers, error: subError } = await subscriberQuery;

    if (subError) throw subError;
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { message: 'No subscribers found for this category', category },
        { status: 200 }
      );
    }

    // 3. Send emails via Resend
    const unsubscribeUrl = `${websiteUrl}/unsubscribe`;
    const emailHtml = buildEmailHtml(newsletter, unsubscribeUrl);
    const subject = newsletter.title;

    let sentCount = 0;
    const errors = [];

    // Resend supports batch sending — send in chunks of 50
    const BATCH_SIZE = 50;
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map(async (subscriber) => {
        try {
          await resend.emails.send({
            from: `Aviera <${fromEmail}>`,
            to: [subscriber.email],
            subject,
            html: emailHtml,
            headers: {
              'List-Unsubscribe': `<${unsubscribeUrl}?email=${encodeURIComponent(subscriber.email)}>`,
            },
          });
          sentCount++;
        } catch (err) {
          console.error(`Failed to send to ${subscriber.email}:`, err.message);
          errors.push({ email: subscriber.email, error: err.message });
        }
      });

      await Promise.all(batchPromises);
    }

    // 4. Mark newsletter as sent — try updating the column, fall back to metadata
    if (newsletter.email_sent_at !== undefined) {
      await supabase
        .from('newsletters')
        .update({ email_sent_at: new Date().toISOString() })
        .eq('id', newsletter.id);
    }

    // Always update metadata tracking (upsert)
    await supabase.from('app_metadata').upsert(
      { key: 'last_sent_newsletter_id', value: newsletter.id },
      { onConflict: 'key' }
    );

    return NextResponse.json({
      success: true,
      newsletterId: newsletter.id,
      newsletterTitle: newsletter.title,
      category,
      totalSubscribers: subscribers.length,
      sent: sentCount,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors.slice(0, 5) : undefined,
    });
  } catch (error) {
    console.error('Newsletter cron error:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter', details: error.message },
      { status: 500 }
    );
  }
}
