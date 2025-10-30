// src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    const timestamp = new Date().toLocaleString('en-KE', { 
      timeZone: 'Africa/Nairobi',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    // 1. Email to ADMIN/BUSINESS
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.CONTACT_RECIPIENT || 'estonkd@gmail.com',
      replyTo: email,
      subject: `📬 New Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { 
              background: linear-gradient(135deg, #05699b 0%, #0891b2 100%); 
              color: white; 
              padding: 40px 30px; 
            }
            .header h1 { margin: 0 0 10px 0; font-size: 28px; }
            .header p { margin: 0; opacity: 0.95; font-size: 15px; }
            .content { padding: 40px 30px; }
            .badge {
              display: inline-block;
              background: #e6f0f5;
              border: 2px solid #05699b;
              color: #05699b;
              padding: 12px 20px;
              border-radius: 8px;
              font-weight: bold;
              margin-bottom: 25px;
              font-size: 14px;
            }
            .section { margin-bottom: 30px; }
            .section-title {
              color: #05699b;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e6f0f5;
            }
            .info-box {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #05699b;
            }
            .info-row {
              margin: 12px 0;
              padding: 8px 0;
              border-bottom: 1px solid #e5e5e5;
            }
            .info-row:last-child { border-bottom: none; }
            .info-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 15px;
              color: #1a1a1a;
              font-weight: 600;
            }
            .message-box {
              background: #fff;
              border: 2px solid #e5e5e5;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              line-height: 1.8;
            }
            .action-buttons {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin: 30px 0;
            }
            .btn {
              display: inline-block;
              padding: 14px 24px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              text-align: center;
              font-size: 14px;
            }
            .btn-primary {
              background: #05699b;
              color: white;
            }
            .btn-secondary {
              background: #e68a00;
              color: white;
            }
            .footer {
              background: #f5f5f5;
              padding: 25px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Contact Form Submission</h1>
              <p>Someone reached out through your website</p>
            </div>
            
            <div class="content">
              <div class="badge">
                ⚡ New Message Received
              </div>

              <!-- Contact Information -->
              <div class="section">
                <div class="section-title">👤 Contact Information</div>
                <div class="info-box">
                  <div class="info-row">
                    <div class="info-label">Full Name</div>
                    <div class="info-value">${name}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Email Address</div>
                    <div class="info-value">
                      <a href="mailto:${email}" style="color: #05699b; text-decoration: none;">${email}</a>
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Phone Number</div>
                    <div class="info-value">
                      <a href="tel:${phone}" style="color: #05699b; text-decoration: none;">${phone}</a>
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Subject</div>
                    <div class="info-value">${subject}</div>
                  </div>
                </div>
              </div>

              <!-- Message Content -->
              <div class="section">
                <div class="section-title">💬 Message</div>
                <div class="message-box">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="action-buttons">
                <a href="mailto:${email}" class="btn btn-primary">
                  ✉️ Reply via Email
                </a>
                <a href="tel:${phone}" class="btn btn-secondary">
                  📞 Call Customer
                </a>
              </div>

              <div style="background: #fef3e2; padding: 20px; border-radius: 8px; border-left: 4px solid #e68a00;">
                <p style="margin: 0; color: #8a5200; font-size: 14px;">
                  <strong>💡 Quick Response Tip:</strong><br>
                  Respond within 24 hours to maintain excellent customer service and increase conversion rates.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 5px 0;"><strong>Eston Distributors - Contact Management</strong></p>
              <p style="margin: 0;">This email was sent from your website contact form</p>
              <p style="margin: 10px 0 0 0; color: #999;">
                ⏰ Received: ${timestamp}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // 2. Auto-reply to CUSTOMER
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: '✅ Message Received - Eston Distributors',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
            }
            .header h1 { margin: 0 0 10px 0; font-size: 32px; }
            .header p { margin: 0; opacity: 0.95; font-size: 16px; }
            .content { padding: 40px 30px; }
            .success-icon {
              text-align: center;
              margin-bottom: 30px;
            }
            .checkmark {
              width: 80px;
              height: 80px;
              background: #d1fae5;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
            }
            .summary-box {
              background: #f9f9f9;
              border: 1px solid #e5e5e5;
              border-radius: 12px;
              padding: 25px;
              margin: 25px 0;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e5e5;
            }
            .summary-row:last-child { border-bottom: none; }
            .summary-label { color: #666; font-size: 14px; }
            .summary-value { font-weight: 600; color: #1a1a1a; font-size: 14px; }
            .info-box {
              background: #e6f0f5;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #05699b;
              margin: 20px 0;
            }
            .contact-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin: 25px 0;
            }
            .contact-item {
              background: #f9f9f9;
              border: 1px solid #e5e5e5;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
            }
            .contact-icon { font-size: 24px; margin-bottom: 8px; }
            .contact-label { font-size: 11px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
            .contact-value { font-size: 14px; font-weight: 600; color: #1a1a1a; }
            .footer {
              background: #f5f5f5;
              padding: 30px;
              text-align: center;
              font-size: 13px;
              color: #666;
            }
            .timeline {
              position: relative;
              padding-left: 30px;
              margin: 25px 0;
            }
            .timeline-item {
              position: relative;
              padding-bottom: 25px;
            }
            .timeline-item:last-child { padding-bottom: 0; }
            .timeline-dot {
              position: absolute;
              left: -30px;
              width: 12px;
              height: 12px;
              background: #10b981;
              border-radius: 50%;
              border: 3px solid #d1fae5;
            }
            .timeline-line {
              position: absolute;
              left: -24px;
              top: 12px;
              width: 2px;
              height: 100%;
              background: #d1fae5;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Message Received!</h1>
              <p>Thank you for contacting us</p>
            </div>
            
            <div class="content">
              <div class="success-icon">
                <div class="checkmark">✓</div>
              </div>

              <p style="font-size: 16px; color: #1a1a1a; text-align: center; margin-bottom: 30px;">
                Dear <strong>${name}</strong>,
              </p>
              
              <p style="font-size: 15px; color: #666; line-height: 1.8; text-align: center;">
                Thank you for reaching out to Eston Distributors! We have received your message and our team will get back to you as soon as possible.
              </p>

              <!-- Message Summary -->
              <div class="summary-box">
                <h3 style="margin-top: 0; color: #1a1a1a; font-size: 18px;">📋 Your Message Summary</h3>
                <div class="summary-row">
                  <span class="summary-label">Subject</span>
                  <span class="summary-value">${subject}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Date Submitted</span>
                  <span class="summary-value">${new Date().toLocaleDateString('en-KE', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Your Email</span>
                  <span class="summary-value">${email}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Your Phone</span>
                  <span class="summary-value">${phone}</span>
                </div>
              </div>

              <!-- What Happens Next -->
              <h3 style="color: #1a1a1a; font-size: 20px; margin-top: 35px;">What Happens Next?</h3>
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-line"></div>
                  <strong style="color: #1a1a1a;">Message Received</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                    ✅ Your inquiry has been successfully submitted
                  </p>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot" style="background: #f79f17;"></div>
                  <div class="timeline-line"></div>
                  <strong style="color: #1a1a1a;">Under Review</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                    Our team is reviewing your message
                  </p>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot" style="background: #ccc;"></div>
                  <strong style="color: #1a1a1a;">Response</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                    We'll respond within 24 hours (business days)
                  </p>
                </div>
              </div>

              <div class="info-box">
                <p style="margin: 0; color: #05699b; font-size: 14px;">
                  <strong>📞 Need Immediate Assistance?</strong><br>
                  For urgent matters, please call our hotline directly.
                </p>
              </div>

              <!-- Contact Information -->
              <h3 style="color: #1a1a1a; font-size: 20px; margin-top: 35px;">Contact Us Directly</h3>
              <div class="contact-grid">
                <div class="contact-item">
                  <div class="contact-icon">📧</div>
                  <div class="contact-label">Email</div>
                  <div class="contact-value">estonkd@gmail.com</div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">📱</div>
                  <div class="contact-label">Phone</div>
                  <div class="contact-value">+254 722 943 291</div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">⏰</div>
                  <div class="contact-label">Business Hours</div>
                  <div class="contact-value">Mon-Fri 8AM-6PM</div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">🚨</div>
                  <div class="contact-label">Emergency</div>
                  <div class="contact-value">24/7 Available</div>
                </div>
              </div>

              <div style="background: #fef3e2; padding: 20px; border-radius: 8px; border-left: 4px solid #e68a00; margin: 30px 0;">
                <p style="margin: 0; color: #8a5200; font-size: 14px; line-height: 1.8;">
                  <strong>💡 Did You Know?</strong><br>
                  We offer competitive bulk pricing and flexible payment terms for large orders. 
                  Ask us about our special rates when we get back to you!
                </p>
              </div>

              <p style="font-size: 15px; color: #666; line-height: 1.8; margin-top: 35px; text-align: center;">
                We appreciate your interest in Eston Distributors and look forward to serving you!
              </p>
              
              <p style="margin-top: 30px; text-align: center;">
                Best regards,<br>
                <strong style="color: #e68a00;">Eston Distributors Team</strong><br>
                <em style="color: #666;">Your Trusted Fuel Distribution Partner</em>
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong>Eston Distributors</strong></p>
              <p style="margin: 0 0 10px 0;">Quality Fuel Distribution | Competitive Prices | Reliable Service</p>
              <p style="margin: 10px 0 0 0; color: #999;">
                This is an automated confirmation email. Please do not reply directly to this message.<br>
                For support, contact us at estonkd@gmail.com or call +254 722 943 291
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}