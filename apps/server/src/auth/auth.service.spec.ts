import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
// import { User as UserDB } from '../../generated/schema';

const moduleMocker = new ModuleMocker(global);

describe('Auth Service', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => {
            console.log(configService.get('JWT_SECRET'));
            return {
              secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
              signOptions: { expiresIn: '3600s' },
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        ConfigService,
        JwtStrategy,
        {
          provide: 'CONNECTION',
          useValue: {
            query: () =>
              ({
                admin: false,
                email: 'mock@email.com',
                id: '123456789',
                name: 'Mock',
                password: 'Mock',
              } as any),
          },
        },
      ],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should retrieve the correct JWT secret', async () => {
    const secret = configService.get('JWT_SECRET');
    expect(secret).toBeTruthy();
  });

  it('should sign an object', () => {
    const token = jwtService.sign({ a: '1', b: '2', c: '3' });
    expect(token).toMatch(/(^[\w-]*\.[\w-]*\.[\w-]*$)/gm);
  });

  it('should return a valid JWT token', async () => {
    const { access_token } = await authService.login({
      admin: false,
      email: 'mock@email.com',
      id: '123456789',
      name: 'Mock',
      password: 'Mock',
    });

    expect(access_token).toMatch(/(^[\w-]*\.[\w-]*\.[\w-]*$)/gm);
  });
});
