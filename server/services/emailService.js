import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      console.log('✅ Email service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  generateStatusChangeEmailTemplate(location, previousStatus, currentStatus) {
    const isOnline = currentStatus === 'online';
    const statusColor = isOnline ? '#10B981' : '#EF4444';
    const statusIcon = isOnline ? '✅' : '❌';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WiFi Status Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .alert-box { border-left: 4px solid ${statusColor}; padding: 15px; background: #f9f9f9; margin: 20px 0; }
          .status { color: ${statusColor}; font-weight: bold; }
          .details { background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusIcon} WiFi Status Alert</h1>
            <p>Location monitoring status has changed</p>
          </div>
          
          <div class="alert-box">
            <h2>Status Change Detected</h2>
            <p><strong>${location.nama}</strong> has changed from <strong>${previousStatus}</strong> to <strong class="status">${currentStatus.toUpperCase()}</strong></p>
          </div>
          
          <div class="details">
            <h3>Location Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${location.nama}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Address:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${location.alamat}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>IP Address:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${location.ip_publik}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Current Status:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;" class="status">${currentStatus.toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Checked At:</strong></td>
                <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>This is an automated message from WiFi Monitoring System.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

const emailService = new EmailService();

export const sendStatusChangeEmail = async (location, previousStatus, currentStatus) => {
  const subject = `WiFi Alert: ${location.nama} is now ${currentStatus.toUpperCase()}`;
  const html = emailService.generateStatusChangeEmailTemplate(location, previousStatus, currentStatus);
  
  return emailService.sendEmail(
    process.env.ADMIN_EMAIL,
    subject,
    html
  );
};

export default emailService;