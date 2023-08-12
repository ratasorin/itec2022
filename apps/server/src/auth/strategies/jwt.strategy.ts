import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { JwtUser, UserDB } from '@shared';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('CONNECTION') private pool: Pool,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // for jwt-strategy passport verifies the JWT signature
  // and decodes the JSON. It invokes validate() passing the
  // decoded JSON as the payload.
  async validate(payload: JwtUser) {
    const { email } = payload;
    const response = await this.pool.query<UserDB>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = response.rows[0];
    return user;
  }
}
