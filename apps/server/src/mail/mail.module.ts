import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: true,
          port: 465,
          auth: {
            user: 'ratasorin0@gmail.com',
            pass: 'iyllcwkrtqglaoqb',
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MailModule {}
