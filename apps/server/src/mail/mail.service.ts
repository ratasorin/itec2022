// import { Injectable } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';

import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

// @Injectable()
// export class MailService {
//   constructor(private readonly mailerService: MailerService) {}

// }

@Injectable()
export class MailService {
  transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: 'email-smtp.us-east-1.amazonaws.com',
      secure: true,
      port: 25,
      auth: {
        user: process.env.SMTP_NAME as string,
        pass: process.env.SMTP_PASSWORD as string,
      },
      from: "'Office booker 3000' <office@booker.com>",
    });
  }

  public async sendMailTo(user_email: string, unverified_id: string) {
    return await this.transporter.sendMail({
      to: user_email,
      from: 'booking-master-3000@gmail.com',
      subject: 'Confirm booking',
      html: `<h1>Please confirm your booking by accessing</h1> <a href = "http://localhost:3000/booking/${unverified_id}"> this link </a>`, // HTML body content
    });
  }
}
