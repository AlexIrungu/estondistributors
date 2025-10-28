// src/lib/services/emailService.js
// Email notification service using Resend

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.ALERT_FROM_EMAIL || 'alerts@estonkd.com';

// Send price alert email
export async function sendPriceAlertEmail({
  to,
  name,
  fuelType,
  location,
  oldPrice,
  newPrice,
  change,
  percentageChange,
}) {
  try {
    const isIncrease = change > 0;
    const changeColor = isIncrease ? '#DC2626' : '#16A34A';
    const changeIcon = isIncrease ? '📈' : '📉';
    const changeText = isIncrease ? 'increased' : 'decreased';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fuel Price Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ${changeIcon} Fuel Price Alert
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                Eston Distributors Price Notification
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                The price of <strong>${fuelType}</strong> in <strong>${location}</strong> has ${changeText}:
              </p>

              <!-- Price Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 2px solid #e5e7eb; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding: 10px; border-right: 1px solid #e5e7eb;">
                          <div style="text-align: center;">
                            <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Previous Price</p>
                            <p style="margin: 0; color: #1f2937; font-size: 24px; font-weight: bold;">
                              KES ${oldPrice.toFixed(2)}
                            </p>
                          </div>
                        </td>
                        <td width="50%" style="padding: 10px;">
                          <div style="text-align: center;">
                            <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">New Price</p>
                            <p style="margin: 0; color: ${changeColor}; font-size: 24px; font-weight: bold;">
                              KES ${newPrice.toFixed(2)}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: ${changeColor}; font-size: 18px; font-weight: bold;">
                        ${change > 0 ? '+' : ''}${change.toFixed(2)} KES (${percentageChange.toFixed(2)}%)
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://estonkd.com/prices" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      View All Prices
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Want to place an order or need more information? Contact us:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                <tr>
                  <td style="color: #3b82f6; font-size: 14px;">
                    📞 <a href="tel:+254722943291" style="color: #3b82f6; text-decoration: none;">+254 722 943 291</a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #3b82f6; font-size: 14px; padding-top: 5px;">
                    📧 <a href="mailto:estonkd@gmail.com" style="color: #3b82f6; text-decoration: none;">estonkd@gmail.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                You're receiving this because you subscribed to price alerts.
              </p>
              <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 12px;">
                <a href="https://estonkd.com/alerts/manage" style="color: #3b82f6; text-decoration: none;">Manage preferences</a> | 
                <a href="https://estonkd.com/alerts/unsubscribe" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                © ${new Date().getFullYear()} Eston Distributors. All rights reserved.
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

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `${changeIcon} ${fuelType} Price ${isIncrease ? 'Increased' : 'Decreased'} by ${Math.abs(percentageChange).toFixed(1)}%`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend email error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      messageId: data.id
    };
  } catch (error) {
    console.error('Error sending price alert email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Send verification email
export async function sendVerificationEmail({ to, name, verificationToken }) {
  try {
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/alerts/verify?token=${verificationToken}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ✉️ Verify Your Email
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                Eston Distributors Price Alerts
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for subscribing to our fuel price alerts! Please verify your email address to start receiving notifications.
              </p>

              <!-- Verification Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${verificationLink}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 10px 0 0 0; color: #3b82f6; font-size: 12px; word-break: break-all;">
                ${verificationLink}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                If you didn't subscribe to price alerts, you can safely ignore this email.
              </p>
              <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 11px;">
                © ${new Date().getFullYear()} Eston Distributors. All rights reserved.
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

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: '✉️ Verify Your Email for Price Alerts',
      html: emailHtml,
    });

    if (error) {
      console.error('Resend verification email error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      messageId: data.id
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Send welcome email
export async function sendWelcomeEmail({ to, name }) {
  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Price Alerts</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎉 Welcome!
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                You're now subscribed to price alerts
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Your email has been verified! You'll now receive notifications whenever fuel prices change according to your preferences.
              </p>

              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Tip:</strong> You can manage your alert preferences anytime from your account settings.
                </p>
              </div>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://estonkd.com/alerts/manage" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Manage Preferences
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                © ${new Date().getFullYear()} Eston Distributors. All rights reserved.
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

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: '🎉 Welcome to Eston Price Alerts!',
      html: emailHtml,
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      messageId: data.id
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}