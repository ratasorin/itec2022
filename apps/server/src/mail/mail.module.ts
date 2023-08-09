// import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { MailService } from './mail.service';
// import { ConfigService } from '@nestjs/config';

// @Module({
//   providers: [MailService],
//   imports: [
//     MailerModule.forRootAsync({
//       useFactory: (configService: ConfigService) => {
//         return {
//           transport: {
//             host: 'email-smtp.us-east-1.amazonaws.com',
//             secure: true,
//             port: 465,
//             auth: {
//               user: configService.get('MAIL_USER'),
//               pass: configService.get('MAIL_PASSWORD'),
//             },
//           },
//           defaults: {
//             from: '"Office booker 3000" <office@booker.com>',
//           },
//         };
//       },
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class MailModule {}

import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  controllers: [],
  providers: [MailService],
})
export class MailModule {}
