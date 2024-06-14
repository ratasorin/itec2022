import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: 'email-smtp.eu-central-1.amazonaws.com',
      secure: true,
      port: 465,
      auth: {
        user: configService.get('SMTP_NAME') as string,
        pass: configService.get('SMTP_PASSWORD') as string,
      },
      from: 'ratasorin0@gmail.com',
    });
  }

  public async sendMailTo(
    recipientEmail: string,
    subject: string,
    htmlPayload: string
  ) {
    return await this.transporter.sendMail({
      to: recipientEmail,
      from: 'ratasorin0@gmail.com',
      subject,
      html: htmlPayload,
    });
  }
}
