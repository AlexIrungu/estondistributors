// src/app/api/order-inquiry/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, phone, fuelType, quantity, deliveryLocation, preferredDate, message } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !fuelType || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email to business (you)
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.CONTACT_RECIPIENT || 'estonkd@gmail.com',
      replyTo: email,
      subject: `🚛 New Fuel Order Inquiry from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #e68a00 0%, #f79f17 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background-color: #ffffff; padding: 30px 20px; }
            .info-box { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e68a00; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #e68a00; display: inline-block; min-width: 140px; }
            .value { color: #333; }
            .message-box { background-color: #fff; padding: 15px; border-left: 4px solid #05699b; margin: 20px 0; line-height: 1.8; }
            .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            .urgent { background-color: #fef3e2; border: 2px solid #f79f17; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚛 New Fuel Order Inquiry</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Eston Distributors - Order Management</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <strong>⚡ Action Required:</strong> New bulk fuel order inquiry received
              </div>

              <h2 style="color: #e68a00; margin-top: 0;">Customer Information</h2>
              <div class="info-box">
                <div class="info-row">
                  <span class="label">Customer Name:</span>
                  <span class="value">${name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${email}" style="color: #05699b;">${email}</a></span>
                </div>
                <div class="info-row">
                  <span class="label">Phone:</span>
                  <span class="value"><a href="tel:${phone}" style="color: #05699b;">${phone}</a></span>
                </div>
              </div>

              <h2 style="color: #e68a00;">Order Details</h2>
              <div class="info-box">
                <div class="info-row">
                  <span class="label">Fuel Type:</span>
                  <span class="value"><strong>${fuelType}</strong></span>
                </div>
                <div class="info-row">
                  <span class="label">Quantity:</span>
                  <span class="value"><strong>${quantity} Liters</strong></span>
                </div>
                <div class="info-row">
                  <span class="label">Delivery Location:</span>
                  <span class="value">${deliveryLocation || 'Not specified'}</span>
                </div>
                <div class="info-row">
                  <span class="label">Preferred Date:</span>
                  <span class="value">${preferredDate || 'ASAP'}</span>
                </div>
              </div>

              ${message ? `
              <h2 style="color: #e68a00;">Additional Message</h2>
              <div class="message-box">
                ${message.replace(/\n/g, '<br>')}
              </div>
              ` : ''}

              <div style="margin-top: 30px; padding: 15px; background-color: #e6f0f5; border-radius: 8px;">
                <p style="margin: 0;"><strong>📞 Quick Actions:</strong></p>
                <p style="margin: 10px 0 0 0;">
                  <a href="mailto:${email}" style="color: #05699b; text-decoration: none;">✉️ Reply via Email</a> | 
                  <a href="tel:${phone}" style="color: #05699b; text-decoration: none;">📱 Call Customer</a>
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">This email was sent from the order inquiry form at estondistributors.vercel.app</p>
              <p style="margin: 5px 0 0 0;">⏰ Received: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Auto-reply to customer
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: '✅ Order Inquiry Received - Eston Distributors',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #e68a00 0%, #f79f17 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #ffffff; padding: 30px 20px; }
            .order-summary { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You for Your Inquiry!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Eston Distributors</p>
            </div>
            
            <div class="content">
              <p>Dear ${name},</p>
              
              <p>Thank you for reaching out to Eston Distributors! We have received your fuel order inquiry and our team will process it shortly.</p>
              
              <div class="order-summary">
                <h3 style="margin-top: 0; color: #e68a00;">Your Inquiry Details:</h3>
                <p><strong>Fuel Type:</strong> ${fuelType}</p>
                <p><strong>Quantity:</strong> ${quantity} Liters</p>
                <p><strong>Delivery Location:</strong> ${deliveryLocation || 'To be confirmed'}</p>
                <p><strong>Preferred Date:</strong> ${preferredDate || 'ASAP'}</p>
              </div>

              <h3 style="color: #05699b;">What Happens Next?</h3>
              <ul style="line-height: 2;">
                <li>✅ Our sales team will review your inquiry</li>
                <li>📞 We'll contact you within 2-4 hours during business hours (Mon-Fri, 8AM-6PM)</li>
                <li>💰 You'll receive a detailed quote including current pricing and delivery costs</li>
                <li>🚛 We'll coordinate the best delivery time that works for you</li>
              </ul>

              <div style="background-color: #e6f0f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Need immediate assistance?</strong></p>
                <p style="margin: 10px 0 0 0;">
                  📧 Email: estonkd@gmail.com<br>
                  📱 Phone: +254 XXX XXX XXX<br>
                  🕐 Business Hours: Monday - Friday, 8:00 AM - 6:00 PM
                </p>
              </div>

              <div style="background-color: #fef3e2; padding: 15px; border-radius: 8px; border-left: 4px solid #e68a00;">
                <p style="margin: 0; color: #8a5200;">
                  <strong>💡 Tip:</strong> Bulk orders qualify for special discounts. Our team will provide you with the best possible pricing based on your order quantity.
                </p>
              </div>

              <p style="margin-top: 30px;">We appreciate your business and look forward to serving you!</p>
              
              <p style="margin-top: 30px;">Best regards,<br>
              <strong>Eston Distributors Team</strong><br>
              <em>Your Trusted Fuel Distribution Partner</em></p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;"><strong>Eston Distributors</strong></p>
              <p style="margin: 5px 0;">Quality Fuel Distribution | Competitive Prices | Reliable Service</p>
              <p style="margin: 10px 0 0 0; color: #999;">
                This is an automated confirmation email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Order inquiry sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Order inquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to send order inquiry', details: error.message },
      { status: 500 }
    );
  }
}