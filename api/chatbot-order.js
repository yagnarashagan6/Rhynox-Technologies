import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { service, name, email, phone, details } = req.body;

    // Validate required fields
    if (!service || !name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create transporter with SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Generate order ID
    const orderId = `RHX-${Date.now().toString().slice(-8)}`;
    const orderDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Email to admin
    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `🚀 New Order from Chatbot - ${service}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; width: 150px; color: #667eea; }
            .detail-value { flex: 1; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .badge { background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Order Received!</h1>
              <p>Order from Rhynox Chatbot</p>
              <span class="badge">Order ID: ${orderId}</span>
            </div>
            <div class="content">
              <h2 style="color: #667eea;">Order Details</h2>
              <div class="order-details">
                <div class="detail-row">
                  <div class="detail-label">📦 Service:</div>
                  <div class="detail-value"><strong>${service}</strong></div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">👤 Name:</div>
                  <div class="detail-value">${name}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">📧 Email:</div>
                  <div class="detail-value">${email}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">📱 Phone:</div>
                  <div class="detail-value">${phone}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">📝 Details:</div>
                  <div class="detail-value">${details || 'No additional details provided'}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">🕐 Date:</div>
                  <div class="detail-value">${orderDate}</div>
                </div>
              </div>
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <strong>⚡ Action Required:</strong>
                <p style="margin: 10px 0 0 0;">Please contact the customer within 24 hours to discuss project requirements and provide a detailed quote.</p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message from Rhynox Chatbot System</p>
              <p>&copy; ${new Date().getFullYear()} Rhynox. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Email to customer
    const customerMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Order Confirmation - ${service} | Rhynox`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .success-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 10px 0; }
            .next-steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .step { display: flex; align-items: start; margin: 15px 0; }
            .step-number { background: #667eea; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
            .contact-info { background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Confirmed!</h1>
              <div class="success-badge">Order ID: ${orderId}</div>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thank you for choosing Rhynox! We're excited to work on your project.</p>
              
              <div class="order-summary">
                <h3 style="color: #667eea; margin-top: 0;">📦 Your Order Summary</h3>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                ${details ? `<p><strong>Project Details:</strong> ${details}</p>` : ''}
              </div>

              <div class="next-steps">
                <h3 style="color: #667eea; margin-top: 0;">📋 What Happens Next?</h3>
                <div class="step">
                  <div class="step-number">1</div>
                  <div>
                    <strong>We'll Contact You</strong>
                    <p style="margin: 5px 0 0 0;">Our team will reach out within 24 hours to discuss your requirements in detail.</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div>
                    <strong>Project Planning</strong>
                    <p style="margin: 5px 0 0 0;">We'll create a detailed project plan and provide you with a comprehensive quote.</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div>
                    <strong>Development Begins</strong>
                    <p style="margin: 5px 0 0 0;">Once approved, our expert team will start bringing your vision to life.</p>
                  </div>
                </div>
              </div>

              <div class="contact-info">
                <h3 style="color: #667eea; margin-top: 0;">📞 Need Immediate Assistance?</h3>
                <p><strong>Email:</strong> ${process.env.SMTP_USER || 'contact@rhynox.com'}</p>
                <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                <p style="margin-bottom: 0;"><strong>Business Hours:</strong> Mon-Sat, 9 AM - 7 PM IST</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://rhynox.com" class="button">Visit Our Website</a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for trusting Rhynox with your digital needs!</p>
              <p>&copy; ${new Date().getFullYear()} Rhynox. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      orderId,
    });

  } catch (error) {
    console.error('Chatbot order error:', error);
    return res.status(500).json({ 
      error: 'Failed to process order',
      details: error.message 
    });
  }
}
