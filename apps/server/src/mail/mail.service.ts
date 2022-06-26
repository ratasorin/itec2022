import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendMailTo(user_email: string, unverified_id: string) {
    return await this.mailerService.sendMail({
      to: user_email,
      from: 'booking-master-3000@gmail.com',
      subject: 'Confirm booking',
      html: `<b>Please confirm your booking by accessing</b> <a href = "http://localhost:3000/booking/${unverified_id}"> this link </a>`, // HTML body content
    });
  }
}
