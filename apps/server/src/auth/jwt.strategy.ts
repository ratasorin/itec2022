import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SECRET } from './constant/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: SECRET,
    });
  }

  // for jwt-strategy passport verifies the JWT signature
  // and decodes the JSON. It inkoves validate() passing the
  // decoded JSON as the payload.
  async validate(payload: any) {
    // Possibly inject business logic
    return { user_id: payload.sub, username: payload.username };
  }
}
