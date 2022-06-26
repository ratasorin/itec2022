import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASSWORD'),
            },
          },
          defaults: {
            from: '"Office booker 3000" <office@booker.com>',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MailModule {}
