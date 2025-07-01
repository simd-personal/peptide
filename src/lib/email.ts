import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Peptide Therapeutics <noreply@yourdomain.com>',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
}

export function generateVerificationEmail(email: string, token: string, firstName?: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  return {
    to: email,
    subject: 'Verify Your Email - Peptide Therapeutics',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Peptide Therapeutics</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Verify Your Email Address</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName || 'there'}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Thank you for creating an account with Peptide Therapeutics. To complete your registration, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="color: #667eea; word-break: break-all; margin-bottom: 30px;">
            ${verificationUrl}
          </p>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            This link will expire in 24 hours. If you didn't create an account with us, 
            you can safely ignore this email.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">© 2024 Peptide Therapeutics. All rights reserved.</p>
        </div>
      </div>
    `
  };
}

export function generatePasswordResetEmail(email: string, token: string, firstName?: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  
  return {
    to: email,
    subject: 'Reset Your Password - Peptide Therapeutics',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Peptide Therapeutics</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName || 'there'}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="color: #667eea; word-break: break-all; margin-bottom: 30px;">
            ${resetUrl}
          </p>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request a password reset, 
            you can safely ignore this email.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">© 2024 Peptide Therapeutics. All rights reserved.</p>
        </div>
      </div>
    `
  };
}

export function generateOrderConfirmationEmail(orderData: any) {
  return {
    to: orderData.email,
    subject: `Order Confirmation #${orderData.orderId} - Peptide Therapeutics`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Peptide Therapeutics</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Order Confirmation</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for your order!</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Items Ordered:</h3>
            ${orderData.items.map((item: any) => `
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span>${item.product.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            We'll send you tracking information once your order ships. 
            If you have any questions, please contact our support team.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">© 2024 Peptide Therapeutics. All rights reserved.</p>
        </div>
      </div>
    `
  };
} 