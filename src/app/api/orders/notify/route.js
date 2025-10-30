// src/app/api/orders/notify/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getServerSession } from 'next-auth';

export async function POST(request) {
  try {
    const session = await getServerSession();
    const { order, customerEmail, customerName } = await request.json();

    // Validate required data
    if (!order) {
      return NextResponse.json(
        { error: 'Order data is required' },
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

    // Format order tracking number
    const trackingNumber = order.id || order._id || `ORD-${Date.now()}`;
    const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const deliveryDate = new Date(order.deliveryDate).toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get status badge color
    const getStatusColor = (status) => {
      const colors = {
        pending: '#f79f17',
        confirmed: '#3b82f6',
        processing: '#8b5cf6',
        dispatched: '#06b6d4',
        delivered: '#10b981',
        cancelled: '#ef4444'
      };
      return colors[status] || '#f79f17';
    };

    // 1. Send email to ADMIN/BUSINESS
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.CONTACT_RECIPIENT || 'estonkd@gmail.com',
      subject: `🔔 New Order #${trackingNumber} - ${order.fuelTypeName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 650px; margin: 0 auto; background: #ffffff; }
            .header { 
              background: linear-gradient(135deg, #e68a00 0%, #f79f17 100%); 
              color: white; 
              padding: 40px 30px; 
              border-radius: 0; 
            }
            .header h1 { margin: 0 0 10px 0; font-size: 28px; }
            .header p { margin: 0; opacity: 0.95; font-size: 16px; }
            .content { padding: 40px 30px; }
            .urgent-badge {
              display: inline-block;
              background: #fef3e2;
              border: 2px solid #f79f17;
              color: #8a5200;
              padding: 12px 20px;
              border-radius: 8px;
              font-weight: bold;
              margin-bottom: 30px;
              font-size: 14px;
            }
            .section { margin-bottom: 30px; }
            .section-title {
              color: #e68a00;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #fde7c5;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #e68a00;
            }
            .info-item { }
            .info-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 16px;
              color: #1a1a1a;
              font-weight: 600;
            }
            .order-summary {
              background: #fff;
              border: 2px solid #e5e5e5;
              border-radius: 12px;
              padding: 25px;
              margin: 20px 0;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #f0f0f0;
            }
            .summary-row:last-child { border-bottom: none; }
            .summary-label { color: #666; font-size: 14px; }
            .summary-value { font-weight: 600; color: #1a1a1a; font-size: 14px; }
            .total-row {
              background: #fef3e2;
              padding: 15px 20px;
              margin: 20px -25px -25px -25px;
              border-radius: 0 0 10px 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .total-label { font-size: 16px; font-weight: bold; color: #8a5200; }
            .total-value { font-size: 28px; font-weight: bold; color: #e68a00; }
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
              background: #e68a00;
              color: white;
            }
            .btn-secondary {
              background: #05699b;
              color: white;
            }
            .delivery-box {
              background: #e6f0f5;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #05699b;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .footer {
              background: #f5f5f5;
              padding: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .divider { height: 2px; background: #e5e5e5; margin: 30px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Order Received!</h1>
              <p>Order #${trackingNumber} • ${orderDate}</p>
            </div>
            
            <div class="content">
              <div class="urgent-badge">
                ⚡ Action Required: New customer order needs processing
              </div>

              <!-- Order Status -->
              <div class="section">
                <div class="section-title">Order Status</div>
                <span class="status-badge" style="background: ${getStatusColor(order.status)}; color: white;">
                  ${(order.status || 'pending').toUpperCase()}
                </span>
              </div>

              <!-- Customer Information -->
              <div class="section">
                <div class="section-title">👤 Customer Information</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Customer Name</div>
                    <div class="info-value">${customerName || session?.user?.name || 'N/A'}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email Address</div>
                    <div class="info-value">${customerEmail || session?.user?.email || 'N/A'}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Order ID</div>
                    <div class="info-value">${trackingNumber}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Order Date</div>
                    <div class="info-value">${orderDate}</div>
                  </div>
                </div>
              </div>

              <!-- Order Details -->
              <div class="section">
                <div class="section-title">📦 Order Details</div>
                <div class="order-summary">
                  <div class="summary-row">
                    <span class="summary-label">Fuel Type</span>
                    <span class="summary-value">${order.fuelTypeName || order.fuelType}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Quantity</span>
                    <span class="summary-value">${order.quantity.toLocaleString()} Liters</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Price per Liter</span>
                    <span class="summary-value">KES ${order.pricePerLiter?.toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Subtotal</span>
                    <span class="summary-value">KES ${order.subtotal?.toLocaleString()}</span>
                  </div>
                  ${order.bulkDiscount > 0 ? `
                  <div class="summary-row" style="color: #10b981;">
                    <span class="summary-label">🎉 Bulk Discount (${order.bulkDiscount}%)</span>
                    <span class="summary-value">-KES ${order.bulkDiscountAmount?.toLocaleString()}</span>
                  </div>
                  ` : ''}
                  <div class="summary-row">
                    <span class="summary-label">Delivery Cost</span>
                    <span class="summary-value">KES ${order.deliveryCost?.toLocaleString()}</span>
                  </div>
                  
                  <div class="total-row">
                    <span class="total-label">Total Amount</span>
                    <span class="total-value">KES ${order.totalCost?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <!-- Delivery Information -->
              <div class="section">
                <div class="section-title">🚚 Delivery Information</div>
                <div class="delivery-box">
                  <p style="margin: 0 0 10px 0;"><strong>Delivery Address:</strong></p>
                  <p style="margin: 0 0 15px 0; line-height: 1.6;">${order.deliveryAddress}</p>
                  
                  <p style="margin: 0 0 5px 0;"><strong>Delivery Zone:</strong> ${order.deliveryZone || 'Standard'}</p>
                  <p style="margin: 0 0 5px 0;"><strong>Preferred Date:</strong> ${deliveryDate}</p>
                  <p style="margin: 0;"><strong>Delivery Time:</strong> ${order.deliveryTime || 'Morning'}</p>
                </div>
              </div>

              ${order.specialInstructions ? `
              <div class="section">
                <div class="section-title">📝 Special Instructions</div>
                <div style="background: #fff; border-left: 4px solid #8b5cf6; padding: 15px; border-radius: 4px; line-height: 1.6;">
                  ${order.specialInstructions}
                </div>
              </div>
              ` : ''}

              <div class="divider"></div>

              <!-- Quick Actions -->
              <div class="action-buttons">
                <a href="mailto:${customerEmail || session?.user?.email}" class="btn btn-primary">
                  ✉️ Email Customer
                </a>
                <a href="tel:${order.phone || ''}" class="btn btn-secondary">
                  📞 Call Customer
                </a>
              </div>

              <div style="background: #fef3e2; padding: 20px; border-radius: 8px; border: 1px solid #f79f17;">
                <p style="margin: 0; color: #8a5200; font-size: 14px;">
                  <strong>⏰ Next Steps:</strong><br>
                  1. Confirm order with customer<br>
                  2. Schedule delivery logistics<br>
                  3. Update order status in dashboard<br>
                  4. Prepare delivery documentation
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong>Eston Distributors - Order Management System</strong></p>
              <p style="margin: 0;">This email was automatically generated from your dashboard</p>
              <p style="margin: 10px 0 0 0; color: #999;">
                ⏰ Received: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // 2. Send confirmation email to CUSTOMER
    if (customerEmail || session?.user?.email) {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: customerEmail || session?.user?.email,
        subject: `✅ Order Confirmation #${trackingNumber} - Eston Distributors`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 650px; margin: 0 auto; background: #ffffff; }
              .header { 
                background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center;
              }
              .header h1 { margin: 0 0 10px 0; font-size: 32px; }
              .header p { margin: 0; opacity: 0.95; font-size: 16px; }
              .content { padding: 40px 30px; }
              .success-badge {
                text-align: center;
                padding: 20px;
                background: #d1fae5;
                border: 2px solid #10b981;
                border-radius: 12px;
                margin-bottom: 30px;
              }
              .success-badge h2 {
                margin: 0 0 5px 0;
                color: #065f46;
                font-size: 24px;
              }
              .success-badge p {
                margin: 0;
                color: #047857;
                font-size: 14px;
              }
              .tracking-box {
                background: #fef3e2;
                border: 2px dashed #e68a00;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                margin: 30px 0;
              }
              .tracking-label {
                font-size: 12px;
                color: #8a5200;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
              }
              .tracking-number {
                font-size: 32px;
                font-weight: bold;
                color: #e68a00;
                letter-spacing: 2px;
              }
              .section { margin-bottom: 35px; }
              .section-title {
                color: #1a1a1a;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #e5e5e5;
              }
              .order-summary {
                background: #f9f9f9;
                border: 1px solid #e5e5e5;
                border-radius: 12px;
                padding: 25px;
                margin: 20px 0;
              }
              .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #e5e5e5;
              }
              .summary-row:last-child { border-bottom: none; }
              .summary-label { color: #666; font-size: 15px; }
              .summary-value { font-weight: 600; color: #1a1a1a; font-size: 15px; }
              .highlight-value { color: #10b981; font-weight: 700; }
              .total-row {
                background: linear-gradient(135deg, #e68a00 0%, #f79f17 100%);
                padding: 20px 25px;
                margin: 20px -25px -25px -25px;
                border-radius: 0 0 10px 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: white;
              }
              .total-label { font-size: 18px; font-weight: bold; }
              .total-value { font-size: 32px; font-weight: bold; }
              .info-box {
                background: #e6f0f5;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #05699b;
                margin: 20px 0;
              }
              .timeline {
                position: relative;
                padding-left: 30px;
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
              .contact-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin: 20px 0;
              }
              .contact-item {
                background: white;
                border: 1px solid #e5e5e5;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
              }
              .contact-icon { font-size: 24px; margin-bottom: 8px; }
              .contact-label { font-size: 12px; color: #666; margin-bottom: 4px; }
              .contact-value { font-size: 14px; font-weight: 600; color: #1a1a1a; }
              .footer {
                background: #f5f5f5;
                padding: 30px;
                text-align: center;
                font-size: 13px;
                color: #666;
              }
              .btn {
                display: inline-block;
                background: #e68a00;
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Order Confirmed!</h1>
                <p>Thank you for your order</p>
              </div>
              
              <div class="content">
                <div class="success-badge">
                  <h2>🎉 Your order has been received!</h2>
                  <p>We're preparing your fuel delivery</p>
                </div>

                <!-- Tracking Number -->
                <div class="tracking-box">
                  <div class="tracking-label">Your Order Tracking Number</div>
                  <div class="tracking-number">${trackingNumber}</div>
                  <p style="margin: 15px 0 0 0; color: #8a5200; font-size: 13px;">
                    Save this number for tracking your order
                  </p>
                </div>

                <p style="font-size: 16px; color: #1a1a1a;">
                  Dear <strong>${customerName || session?.user?.name || 'Valued Customer'}</strong>,
                </p>
                <p style="font-size: 15px; color: #666; line-height: 1.8;">
                  Thank you for choosing Eston Distributors! Your order has been successfully received and is being processed. 
                  Our team will contact you shortly to confirm the delivery details.
                </p>

                <!-- Order Summary -->
                <div class="section">
                  <div class="section-title">📦 Order Summary</div>
                  <div class="order-summary">
                    <div class="summary-row">
                      <span class="summary-label">Order Number</span>
                      <span class="summary-value">${trackingNumber}</span>
                    </div>
                    <div class="summary-row">
                      <span class="summary-label">Order Date</span>
                      <span class="summary-value">${orderDate}</span>
                    </div>
                    <div class="summary-row">
                      <span class="summary-label">Fuel Type</span>
                      <span class="summary-value">${order.fuelTypeName || order.fuelType}</span>
                    </div>
                    <div class="summary-row">
                      <span class="summary-label">Quantity</span>
                      <span class="summary-value">${order.quantity.toLocaleString()} Liters</span>
                    </div>
                    <div class="summary-row">
                      <span class="summary-label">Price per Liter</span>
                      <span class="summary-value">KES ${order.pricePerLiter?.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                      <span class="summary-label">Subtotal</span>
                      <span class="summary-value">KES ${order.subtotal?.toLocaleString()}</span>
                    </div>
                    ${order.bulkDiscount > 0 ? `
                    <div class="summary-row">
                      <span class="summary-label">🎉 Bulk Discount (${order.bulkDiscount}%)</span>
                      <span class="summary-value highlight-value">-KES ${order.bulkDiscountAmount?.toLocaleString()}</span>
                    </div>
                    ` : ''}
                    <div class="summary-row">
                      <span class="summary-label">Delivery Cost</span>
                      <span class="summary-value">KES ${order.deliveryCost?.toLocaleString()}</span>
                    </div>
                    
                    <div class="total-row">
                      <span class="total-label">Total Amount</span>
                      <span class="total-value">KES ${order.totalCost?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <!-- Delivery Information -->
                <div class="section">
                  <div class="section-title">🚚 Delivery Details</div>
                  <div class="info-box">
                    <p style="margin: 0 0 10px 0;"><strong>Delivery Address:</strong></p>
                    <p style="margin: 0 0 20px 0; line-height: 1.6;">${order.deliveryAddress}</p>
                    
                    <p style="margin: 0 0 8px 0;"><strong>Scheduled Date:</strong> ${deliveryDate}</p>
                    <p style="margin: 0;"><strong>Delivery Time:</strong> ${order.deliveryTime || 'Morning'} (We'll call to confirm exact time)</p>
                  </div>
                </div>

                <!-- What Happens Next -->
                <div class="section">
                  <div class="section-title">📋 What Happens Next?</div>
                  <div class="timeline">
                    <div class="timeline-item">
                      <div class="timeline-dot"></div>
                      <div class="timeline-line"></div>
                      <strong>Order Confirmation</strong>
                      <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                        ✅ Your order has been received and confirmed
                      </p>
                    </div>
                    <div class="timeline-item">
                      <div class="timeline-dot" style="background: #f79f17;"></div>
                      <div class="timeline-line"></div>
                      <strong>Processing</strong>
                      <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                        Our team will contact you within 2-4 hours to confirm delivery details
                      </p>
                    </div>
                    <div class="timeline-item">
                      <div class="timeline-dot" style="background: #ccc;"></div>
                      <div class="timeline-line"></div>
                      <strong>Preparation</strong>
                      <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                        Your fuel order will be prepared and loaded for delivery
                      </p>
                    </div>
                    <div class="timeline-item">
                      <div class="timeline-dot" style="background: #ccc;"></div>
                      <strong>Delivery</strong>
                      <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                        Scheduled for ${deliveryDate}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="section">
                  <div class="section-title">📞 Need Help?</div>
                  <p style="color: #666; margin-bottom: 15px;">Our customer support team is here to assist you</p>
                  <div class="contact-grid">
                    <div class="contact-item">
                      <div class="contact-icon">📧</div>
                      <div class="contact-label">Email Us</div>
                      <div class="contact-value">estonkd@gmail.com</div>
                    </div>
                    <div class="contact-item">
                      <div class="contact-icon">📱</div>
                      <div class="contact-label">Call Us</div>
                      <div class="contact-value">+254 XXX XXX XXX</div>
                    </div>
                  </div>
                </div>

                <div style="background: #fef3e2; padding: 20px; border-radius: 8px; border-left: 4px solid #e68a00; margin: 30px 0;">
                  <p style="margin: 0; color: #8a5200; font-size: 14px; line-height: 1.8;">
                    <strong>💡 Important:</strong> Please ensure someone is available at the delivery address to receive the order. 
                    Our driver will call you 30 minutes before arrival.
                  </p>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                  <p style="font-size: 16px; color: #1a1a1a; margin-bottom: 10px;">
                    Track your order status in your dashboard
                  </p>
                  <a href="${process.env.NEXTAUTH_URL || 'https://estondistributors.vercel.app'}/dashboard/orders" class="btn">
                    View Order Status
                  </a>
                </div>

                <p style="font-size: 15px; color: #666; line-height: 1.8; margin-top: 30px;">
                  Thank you for choosing Eston Distributors. We appreciate your business and look forward to serving you!
                </p>
                
                <p style="margin-top: 30px;">
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
                  For support, contact us at estonkd@gmail.com
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    }

    return NextResponse.json(
      { success: true, message: 'Order notifications sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Order notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send order notifications', details: error.message },
      { status: 500 }
    );
  }
}