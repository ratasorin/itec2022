import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import request from 'supertest';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('Auth Controller', () => {
  let app: INestApplication;
  const authService = {
    login: () => ({ access_token: 'a.b.c' }),
    signUp: () => ({ access_token: 'e.f.g' }),
    validateUser: (email: string, password: string) =>
      email === 'ratasorin0@gmail.com' && password === 'Sorin',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
        {
          provide: APP_GUARD,
          useClass: LocalAuthGuard,
        },
      ],
    })
      .useMocker((token) => {
        const mockMetadata = moduleMocker.getMetadata(
          token
        ) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should login an user with correct credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ratasorin0@gmail.com', password: 'Sorin' });
    expect(response.body.access_token).toBe('a.b.c');
  });

  it('should deny an user with incorrect credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ratasorin0@gmail.com', password: '***' })
      .expect(401);

    expect(response.body.access_token).not.toBe('a.b.c');
  });

  afterAll(async () => {
    await app.close();
  });
});
