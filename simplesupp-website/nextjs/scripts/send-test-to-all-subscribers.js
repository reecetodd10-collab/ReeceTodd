/**
 * Send Test Newsletter to All Subscribers
 *
 * This script sends a test email with the latest newsletter
 * to all subscribers in the newsletter_subscribers table.
 *
 * Usage: node scripts/send-test-to-all-subscribers.js
 */

const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

async function sendTestToAll() {
  console.log('\n📧 Sending test newsletter to all subscribers...\n');

  // Load environment variables
  const fs = require('fs');
  const path = require('path');

  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
  } catch (err) {
    console.log('⚠️  Could not load .env.local file:', err.message);
  }

  // Initialize Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Get all subscribers
  console.log('1. Fetching subscribers from database...');
  const { data: subscribers, error: subError } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('subscribed', true);

  if (subError || !subscribers || subscribers.length === 0) {
    console.log('❌ No subscribers found in database!');
    process.exit(1);
  }

  console.log(`✅ Found ${subscribers.length} subscribers\n`);

  // Get latest newsletter
  console.log('2. Fetching latest newsletter from database...');
  const { data: newsletters, error } = await supabase
    .from('newsletters')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(1);

  if (error || !newsletters || newsletters.length === 0) {
    console.log('❌ No newsletters found in database!');
    console.log('Run Modal script first to generate a newsletter.');
    process.exit(1);
  }

  const newsletter = newsletters[0];
  console.log(`✅ Found: ${newsletter.title}\n`);

  // Create email HTML
  const newsletterDate = new Date(newsletter.published_date);
  const websiteUrl = 'http://localhost:3001'; // Change to your production URL
  const newsletterUrl = `${websiteUrl}/news/${newsletter.id}`;

  const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aviera News</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);">
                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 1px;">
                    AVIERA NEWS
                </h1>
                <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">
                    The Latest in Fitness
                </p>
            </td>
        </tr>

        <!-- Main Content -->
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 700; line-height: 1.3;">
                    ${newsletterDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} Edition
                </h2>

                <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                    ${newsletter.excerpt}
                </p>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                        <td style="text-align: center;">
                            <a href="${newsletterUrl}" style="display: inline-block; padding: 16px 40px; background-color: #00d9ff; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);">
                                Read Full Newsletter →
                            </a>
                        </td>
                    </tr>
                </table>

                <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    This week's edition covers the latest in fitness science, supplement research, and evidence-based training strategies.
                </p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e0e0e0; text-align: center;">
                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                    This is a test email from Aviera News
                </p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${newsletterDate.getFullYear()} Aviera. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;

  // Check if Resend API key is available
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log('❌ RESEND_API_KEY not found in .env.local!');
    console.log('\nAdd it to your .env.local file:');
    console.log('RESEND_API_KEY=re_your_key_here\n');
    console.log('📧 Email preview saved to: preview-email.html');

    // Save preview
    fs.writeFileSync('preview-email.html', emailHtml);
    console.log('Open preview-email.html in your browser to see the email!\n');
    return;
  }

  // Send email with Resend to all subscribers
  console.log('3. Sending emails via Resend...\n');

  const resend = new Resend(resendApiKey);
  const emailAddresses = subscribers.map(sub => sub.email);

  console.log(`   Recipients: ${emailAddresses.join(', ')}`);
  console.log(`   Subject: Aviera News - ${newsletterDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n`);

  try {
    const data = await resend.emails.send({
      from: 'Aviera News <info@avierafit.com>',
      to: emailAddresses,
      subject: `Aviera News - ${newsletterDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      html: emailHtml,
    });

    console.log('✅ Emails sent successfully!');
    console.log(`   Email ID: ${data.id}`);
    console.log(`\n📬 Check your inboxes for the newsletter!\n`);
    console.log(`   Sent to: ${emailAddresses.join(', ')}\n`);

  } catch (error) {
    console.error('❌ Failed to send emails:', error.message);

    // Save preview instead
    console.log('\n📧 Saving email preview instead...');
    fs.writeFileSync('preview-email.html', emailHtml);
    console.log('✅ Email preview saved to: preview-email.html');
    console.log('Open preview-email.html in your browser to see the email!\n');
  }
}

sendTestToAll().catch(console.error);
