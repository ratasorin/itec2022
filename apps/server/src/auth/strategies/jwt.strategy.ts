import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { SECRET } from '../constant/jwt';
import { JwtUser } from '../interface';
import { Pool } from 'pg';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('CONNECTION') private pool: Pool) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      ignoreExpiration: true,
      secretOrKey: SECRET,
    });
  }

  // for jwt-strategy passport verifies the JWT signature
  // and decodes the JSON. It invokes validate() passing the
  // decoded JSON as the payload.
  async validate(payload: JwtUser) {
    const { name } = payload;
    const user = await this.pool.query(`SELECT * FROM users WHERE name = $1`, [
      name,
    ]);
    return user;
  }
}
