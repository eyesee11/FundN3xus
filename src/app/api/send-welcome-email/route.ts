import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Create transporter using SMTP credentials from environment
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // HTML email template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FundN3xus</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #0f172a;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: #e2e8f0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 40px 32px;
                text-align: center;
            }
            .logo {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
            }
            .logo-icon {
                width: 32px;
                height: 32px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 18px;
            }
            .logo-text {
                font-size: 24px;
                font-weight: bold;
                color: white;
                margin: 0;
            }
            .welcome-title {
                font-size: 28px;
                font-weight: bold;
                color: white;
                margin: 16px 0 8px 0;
            }
            .welcome-subtitle {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.9);
                margin: 0;
            }
            .content {
                padding: 40px 32px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 24px;
                color: #e2e8f0;
            }
            .feature-list {
                list-style: none;
                padding: 0;
                margin: 24px 0;
            }
            .feature-item {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
                padding: 16px;
                background: rgba(16, 185, 129, 0.1);
                border-radius: 8px;
                border-left: 3px solid #10b981;
            }
            .feature-icon {
                width: 20px;
                height: 20px;
                background: #10b981;
                border-radius: 50%;
                margin-right: 12px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
            }
            .feature-text {
                color: #cbd5e1;
                margin: 0;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-weight: 600;
                text-align: center;
                margin: 32px 0;
                transition: transform 0.2s;
            }
            .footer {
                background: rgba(15, 23, 42, 0.5);
                padding: 32px;
                text-align: center;
                border-top: 1px solid rgba(55, 65, 81, 0.3);
            }
            .footer-text {
                color: #94a3b8;
                font-size: 14px;
                margin: 8px 0;
            }
            .contact-info {
                color: #10b981;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <div class="logo-icon">💰</div>
                    <h1 class="logo-text">FundN3xus</h1>
                </div>
                <h1 class="welcome-title">Welcome to FundN3xus!</h1>
                <p class="welcome-subtitle">Your AI-powered financial planning journey starts here</p>
            </div>
            
            <div class="content">
                <p class="greeting">Hello ${name},</p>
                <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
                    Thank you for joining FundN3xus! We're excited to help you take control of your financial future with our AI-powered tools and insights.
                </p>
                
                <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
                    Here's what you can do with FundN3xus:
                </p>
                
                <ul class="feature-list">
                    <li class="feature-item">
                        <div class="feature-icon">📊</div>
                        <p class="feature-text">Get AI-powered investment analysis and portfolio rebalancing suggestions</p>
                    </li>
                    <li class="feature-item">
                        <div class="feature-icon">🏠</div>
                        <p class="feature-text">Simulate affordability for major purchases like homes and cars</p>
                    </li>
                    <li class="feature-item">
                        <div class="feature-icon">🔮</div>
                        <p class="feature-text">Explore financial scenarios and plan for different life events</p>
                    </li>
                    <li class="feature-item">
                        <div class="feature-icon">💬</div>
                        <p class="feature-text">Chat with our AI financial advisor for personalized guidance</p>
                    </li>
                </ul>
                
                <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 32px;">
                    Ready to get started? Log in to your account and begin your financial transformation today.
                </p>
                
                <a href="http://localhost:9002/login" class="cta-button">Start Your Journey</a>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    <strong>FundN3xus</strong><br>
                    <a href="mailto:contact@FundN3xus.com" class="contact-info">contact@FundN3xus.com</a><br>
                    +91 98765 43210<br>
                    123 Fintech Avenue, Mumbai, India
                </p>
                <p class="footer-text">
                    © 2025 FundN3xus. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome to FundN3xus - Your Financial Journey Begins! 🚀',
      html: htmlTemplate,
      text: `
        Welcome to FundN3xus, ${name}!
        
        Thank you for joining FundN3xus! We're excited to help you take control of your financial future with our AI-powered tools and insights.
        
        Here's what you can do with FundN3xus:
        • Get AI-powered investment analysis and portfolio rebalancing suggestions
        • Simulate affordability for major purchases like homes and cars
        • Explore financial scenarios and plan for different life events
        • Chat with our AI financial advisor for personalized guidance
        
        Ready to get started? Log in to your account and begin your financial transformation today.
        
        Visit: http://localhost:9002/login
        
        Best regards,
        The FundN3xus Team
        
        Contact us:
        Email: contact@FundN3xus.com
        Phone: +91 98765 43210
        Address: 123 Fintech Avenue, Mumbai, India
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    );
  }
}
