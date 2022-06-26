import { MailerModule } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('Email Service', () => {
  let mailService: MailService;
  let configService: ConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
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
      providers: [MailService, ConfigService],
    }).compile();
    mailService = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  it('should find username and password for sending emails', () => {
    const user = configService.get('MAIL_USER');
    const pass = configService.get('MAIL_PASSWORD');
    expect(user).toBeTruthy();
    expect(pass).toBeTruthy();
  });

  it('should send email to a user', async () => {
    const email = configService.get('MAIL_USER');
    await expect(
      mailService.sendMailTo(email, '123456789')
    ).resolves.not.toThrowError();
  });
});
