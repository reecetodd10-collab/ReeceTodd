import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Test endpoint to preview order confirmation email
export async function GET() {
  try {
    // Sample order data for preview
    const sampleOrder = {
      order_number: '1042',
      name: 'Reece Todd',
      total_price: '92.72',
      currency: 'USD',
      line_items: [
        { name: 'Advanced 100% Whey Protein Isolate (Chocolate)', quantity: 1, price: '42.74' },
        { name: 'Creatine Monohydrate', quantity: 2, price: '24.99' },
      ],
      shipping_address: {
        name: 'Reece Todd',
        address1: '123 Main Street',
        address2: 'Apt 4B',
        city: 'New York',
        province: 'NY',
        zip: '10001',
        country: 'United States',
      },
    };

    // Format order items for email
    const itemsList = sampleOrder.line_items.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(0, 217, 255, 0.2);">
          <div>
            <p style="margin: 0; color: #ffffff; font-weight: 500;">${item.name}</p>
            <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 14px;">Qty: ${item.quantity}</p>
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid rgba(0, 217, 255, 0.2); text-align: right; color: #00d9ff; font-weight: 600;">
          $${parseFloat(item.price).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Aviera</title>
</head>
<body style="margin: 0; padding: 0; background-color: #001018; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #001018;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">

          <!-- Header with Logo -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(0, 184, 212, 0.1)); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 16px;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 8px;">
                  <span style="color: #00d9ff;">A</span><span style="color: #ffffff;">VIERA</span>
                </h1>
              </div>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(180deg, rgba(0, 30, 45, 0.95), rgba(0, 20, 30, 0.98)); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 16px; box-shadow: 0 0 40px rgba(0, 217, 255, 0.15);">

                <!-- Success Icon & Title -->
                <tr>
                  <td style="padding: 40px 32px 24px 32px; text-align: center;">
                    <div style="width: 80px; height: 80px; margin: 0 auto 24px auto; background: linear-gradient(135deg, #00d9ff, #00b8d4); border-radius: 50%; line-height: 80px; text-align: center;">
                      <span style="font-size: 40px; color: #001018;">✓</span>
                    </div>
                    <h2 style="margin: 0 0 8px 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                      Thank You for Your Order!
                    </h2>
                    <p style="margin: 0; color: #9ca3af; font-size: 16px;">
                      Order #${sampleOrder.order_number}
                    </p>
                  </td>
                </tr>

                <!-- Personal Message -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <p style="margin: 0; color: #e5e7eb; font-size: 16px; line-height: 1.6; text-align: center;">
                      Hey Reece! 🎉 Your order is confirmed and we're getting it ready.
                      You're one step closer to reaching your fitness goals with Aviera.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 32px;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.5), transparent);"></div>
                  </td>
                </tr>

                <!-- Order Summary -->
                <tr>
                  <td style="padding: 32px;">
                    <h3 style="margin: 0 0 20px 0; color: #00d9ff; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                      Order Summary
                    </h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      ${itemsList}
                      <tr>
                        <td style="padding: 20px 0 0 0;">
                          <p style="margin: 0; color: #9ca3af; font-size: 14px;">Total</p>
                        </td>
                        <td style="padding: 20px 0 0 0; text-align: right;">
                          <p style="margin: 0; color: #00d9ff; font-size: 24px; font-weight: 700;">
                            $${sampleOrder.total_price} ${sampleOrder.currency}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Shipping Address -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <div style="background: rgba(0, 217, 255, 0.05); border: 1px solid rgba(0, 217, 255, 0.2); border-radius: 12px; padding: 20px;">
                      <h4 style="margin: 0 0 12px 0; color: #00d9ff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        Shipping To
                      </h4>
                      <p style="margin: 0; color: #e5e7eb; font-size: 14px; line-height: 1.6;">
                        ${sampleOrder.shipping_address.name}<br>
                        ${sampleOrder.shipping_address.address1}<br>
                        ${sampleOrder.shipping_address.address2}<br>
                        ${sampleOrder.shipping_address.city}, ${sampleOrder.shipping_address.province} ${sampleOrder.shipping_address.zip}<br>
                        ${sampleOrder.shipping_address.country}
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- What's Next -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 18px; font-weight: 600;">
                      What's Next?
                    </h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #00d9ff; margin-right: 12px;">📦</span>
                          <span style="color: #e5e7eb;">We'll send you a shipping confirmation with tracking</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #00d9ff; margin-right: 12px;">🚚</span>
                          <span style="color: #e5e7eb;">Orders typically ship within 1-2 business days</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #00d9ff; margin-right: 12px;">💪</span>
                          <span style="color: #e5e7eb;">Get ready to crush your goals with Aviera!</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 32px 40px 32px; text-align: center;">
                    <a href="https://avierafit.com/shop" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #00d9ff, #00b8d4); color: #001018; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 12px; box-shadow: 0 0 25px rgba(0, 217, 255, 0.5);">
                      Continue Shopping
                    </a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 20px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                Questions? Reply to this email or visit <a href="https://avierafit.com" style="color: #00d9ff; text-decoration: none;">avierafit.com</a>
              </p>
              <p style="margin: 0; color: #4b5563; font-size: 12px;">
                © ${new Date().getFullYear()} Aviera. All rights reserved.
              </p>
              <p style="margin: 8px 0 0 0; color: #4b5563; font-size: 11px; font-style: italic;">
                This is a test email - no actual order was placed.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send test email
    const { data, error } = await resend.emails.send({
      from: 'Aviera <info@avierafit.com>',
      to: 'reecetodd10@gmail.com',
      subject: '🎉 Order Confirmed! #1042 (TEST EMAIL)',
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent to reecetodd10@gmail.com',
      emailId: data?.id
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
