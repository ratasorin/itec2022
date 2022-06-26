import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { SECRET } from '../constant/jwt';
import { JwtUser } from '../interface';
import { Pool } from 'pg';
import { UserDB } from '../../user/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('CONNECTION') private pool: Pool) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: SECRET,
    });
  }

  // for jwt-strategy passport verifies the JWT signature
  // and decodes the JSON. It invokes validate() passing the
  // decoded JSON as the payload.
  async validate(payload: JwtUser) {
    console.log({ payload });
    const { email } = payload;
    const response = await this.pool.query<UserDB>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = response.rows[0];
    return user;
  }
}
