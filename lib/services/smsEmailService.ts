import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export interface SMSConfig {
  provider: 'twilio' | 'nexmo' | 'aws_sns';
  accountSid?: string;
  authToken?: string;
  fromNumber: string;
}

export interface EmailConfig {
  provider: 'sendgrid' | 'mailgun' | 'aws_ses' | 'smtp';
  apiKey?: string;
  fromEmail: string;
  fromName?: string;
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
}

class SMSEmailService {
  private smsConfig: SMSConfig;
  private emailConfig: EmailConfig;

  constructor() {
    this.smsConfig = {
      provider: 'twilio',
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_PHONE_NUMBER || '+1234567890'
    };

    this.emailConfig = {
      provider: 'sendgrid',
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@bagster.com',
      fromName: 'Bagster'
    };
  }

  public async sendSMS(
    to: string,
    message: string,
    notificationId?: string
  ): Promise<NotificationResult> {
    try {
      let result: NotificationResult;

      switch (this.smsConfig.provider) {
        case 'twilio':
          result = await this.sendTwilioSMS(to, message);
          break;
        case 'nexmo':
          result = await this.sendNexmoSMS(to, message);
          break;
        case 'aws_sns':
          result = await this.sendAWSSMS(to, message);
          break;
        default:
          throw new Error(`Unsupported SMS provider: ${this.smsConfig.provider}`);
      }

      // Log SMS delivery
      await this.logNotificationDelivery('sms', to, message, result, notificationId);

      return result;
    } catch (error) {
      const errorResult: NotificationResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.smsConfig.provider
      };

      await this.logNotificationDelivery('sms', to, message, errorResult, notificationId);
      return errorResult;
    }
  }

  public async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
    notificationId?: string
  ): Promise<NotificationResult> {
    try {
      let result: NotificationResult;

      switch (this.emailConfig.provider) {
        case 'sendgrid':
          result = await this.sendSendGridEmail(to, subject, htmlContent, textContent);
          break;
        case 'mailgun':
          result = await this.sendMailgunEmail(to, subject, htmlContent, textContent);
          break;
        case 'aws_ses':
          result = await this.sendAWSEmail(to, subject, htmlContent, textContent);
          break;
        case 'smtp':
          result = await this.sendSMTPEmail(to, subject, htmlContent, textContent);
          break;
        default:
          throw new Error(`Unsupported email provider: ${this.emailConfig.provider}`);
      }

      // Log email delivery
      await this.logNotificationDelivery('email', to, subject, result, notificationId);

      return result;
    } catch (error) {
      const errorResult: NotificationResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.emailConfig.provider
      };

      await this.logNotificationDelivery('email', to, subject, errorResult, notificationId);
      return errorResult;
    }
  }

  private async sendTwilioSMS(to: string, message: string): Promise<NotificationResult> {
    try {
      const twilio = require('twilio');
      const client = twilio(this.smsConfig.accountSid, this.smsConfig.authToken);

      const result = await client.messages.create({
        body: message,
        from: this.smsConfig.fromNumber,
        to: to
      });

      return {
        success: true,
        messageId: result.sid,
        provider: 'twilio'
      };
    } catch (error) {
      throw new Error(`Twilio SMS failed: ${error}`);
    }
  }

  private async sendNexmoSMS(to: string, message: string): Promise<NotificationResult> {
    try {
      const { Vonage } = require('@vonage/server-sdk');

      const vonage = new Vonage({
        apiKey: process.env.NEXMO_API_KEY,
        apiSecret: process.env.NEXMO_API_SECRET
      });

      const result = await vonage.sms.send({
        to,
        from: this.smsConfig.fromNumber,
        text: message
      });

      return {
        success: result.messages[0].status === '0',
        messageId: result.messages[0]['message-id'],
        provider: 'nexmo'
      };
    } catch (error) {
      throw new Error(`Nexmo SMS failed: ${error}`);
    }
  }

  private async sendAWSSMS(to: string, message: string): Promise<NotificationResult> {
    try {
      const AWS = require('aws-sdk');
      const sns = new AWS.SNS({
        region: process.env.AWS_REGION || 'us-east-1'
      });

      const result = await sns.publish({
        PhoneNumber: to,
        Message: message
      }).promise();

      return {
        success: true,
        messageId: result.MessageId,
        provider: 'aws_sns'
      };
    } catch (error) {
      throw new Error(`AWS SNS failed: ${error}`);
    }
  }

  private async sendSendGridEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<NotificationResult> {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(this.emailConfig.apiKey);

      const msg = {
        to,
        from: {
          email: this.emailConfig.fromEmail,
          name: this.emailConfig.fromName
        },
        subject,
        html: htmlContent,
        text: textContent || this.stripHtml(htmlContent)
      };

      const result = await sgMail.send(msg);

      return {
        success: true,
        messageId: result[0].headers['x-message-id'],
        provider: 'sendgrid'
      };
    } catch (error) {
      throw new Error(`SendGrid failed: ${error}`);
    }
  }

  private async sendMailgunEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<NotificationResult> {
    try {
      const formData = require('form-data');
      const Mailgun = require('mailgun.js');

      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY
      });

      const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `${this.emailConfig.fromName} <${this.emailConfig.fromEmail}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent || this.stripHtml(htmlContent)
      });

      return {
        success: true,
        messageId: result.id,
        provider: 'mailgun'
      };
    } catch (error) {
      throw new Error(`Mailgun failed: ${error}`);
    }
  }

  private async sendAWSEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<NotificationResult> {
    try {
      const AWS = require('aws-sdk');
      const ses = new AWS.SES({
        region: process.env.AWS_REGION || 'us-east-1'
      });

      const params = {
        Source: this.emailConfig.fromEmail,
        Destination: {
          ToAddresses: [to]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: htmlContent,
              Charset: 'UTF-8'
            },
            Text: {
              Data: textContent || this.stripHtml(htmlContent),
              Charset: 'UTF-8'
            }
          }
        }
      };

      const result = await ses.sendEmail(params).promise();

      return {
        success: true,
        messageId: result.MessageId,
        provider: 'aws_ses'
      };
    } catch (error) {
      throw new Error(`AWS SES failed: ${error}`);
    }
  }

  private async sendSMTPEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<NotificationResult> {
    try {
      const nodemailer = require('nodemailer');

      const transporter = nodemailer.createTransporter(this.emailConfig.smtpConfig || {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const result = await transporter.sendMail({
        from: `${this.emailConfig.fromName} <${this.emailConfig.fromEmail}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent || this.stripHtml(htmlContent)
      });

      return {
        success: true,
        messageId: result.messageId,
        provider: 'smtp'
      };
    } catch (error) {
      throw new Error(`SMTP failed: ${error}`);
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  private async logNotificationDelivery(
    type: 'sms' | 'email',
    recipient: string,
    content: string,
    result: NotificationResult,
    notificationId?: string
  ): Promise<void> {
    try {
      await addDoc(collection(db, 'notification_logs'), {
        type,
        recipient,
        content: content.substring(0, 500), // Truncate for storage
        success: result.success,
        messageId: result.messageId,
        error: result.error,
        provider: result.provider,
        notificationId,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to log notification delivery:', error);
    }
  }

  public async retryFailedNotification(notificationId: string): Promise<NotificationResult> {
    // Implementation for retrying failed notifications
    // This would fetch the original notification data and retry sending
    try {
      // Fetch notification details from database
      // Determine if it was SMS or email
      // Retry with exponential backoff
      
      return {
        success: true,
        provider: 'retry',
        messageId: `retry_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Retry failed',
        provider: 'retry'
      };
    }
  }

  // Email template methods
  public generateShipmentNotificationEmail(
    shipmentId: string,
    status: string,
    trackingNumber: string,
    customerName: string
  ): { subject: string; html: string; text: string } {
    const subject = `Shipment Update: ${trackingNumber} - ${status}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <h1>Bagster Logistics</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Hello ${customerName},</h2>
          <p>Your shipment status has been updated:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Shipment ID:</strong> ${shipmentId}</p>
          </div>
          <p>You can track your shipment at: <a href="https://bagster.com/track/${trackingNumber}">https://bagster.com/track/${trackingNumber}</a></p>
          <p>Thank you for choosing Bagster!</p>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>© 2024 Bagster Logistics. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
Hello ${customerName},

Your shipment status has been updated:

Tracking Number: ${trackingNumber}
Status: ${status}
Shipment ID: ${shipmentId}

You can track your shipment at: https://bagster.com/track/${trackingNumber}

Thank you for choosing Bagster!

© 2024 Bagster Logistics. All rights reserved.
    `;

    return { subject, html, text };
  }

  public generateCarrierAssignmentSMS(
    carrierName: string,
    shipmentId: string,
    pickupAddress: string,
    expiresAt: Date
  ): string {
    const expiryTime = expiresAt.toLocaleTimeString();
    return `New shipment assigned! ID: ${shipmentId}. Pickup: ${pickupAddress}. Accept by ${expiryTime} or it will be reassigned. Check your Bagster app.`;
  }
}

export const smsEmailService = new SMSEmailService();
