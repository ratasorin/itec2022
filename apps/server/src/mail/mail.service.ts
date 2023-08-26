import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: 'email-smtp.eu-central-1.amazonaws.com',
      secure: true,
      port: 465,
      auth: {
        user: process.env.SMTP_NAME as string,
        pass: process.env.SMTP_PASSWORD as string,
      },
      from: 'ratasorinwork@gmail.com',
    });
  }

  public async sendMailTo(
    recipient_email: string,
    subject: string,
    htmlPayload: string
  ) {
    return await this.transporter.sendMail({
      to: recipient_email,
      from: 'ratasorinwork@gmail.com',
      subject,
      html: htmlPayload,
    });
  }
}
