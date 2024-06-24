import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { JwtUser, users } from '@shared';
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

  // when using the "jwt-strategy" passport verifies the JWT signature and decodes the JSON based on the options given in the constructor.
  // Then it invokes the `validate()` function, passing the decoded JSON as an argument (here: "payload").
  async validate(payload: JwtUser) {
    const { email } = payload;
    const response = await this.pool.query<users>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = response.rows[0];

    // "Recall again that Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object." (source: https://docs.nestjs.com/recipes/passport)
    // so the return value will be attached to: `@Req() req -> req.user`, not to: `@Body('user') user`
    return user;
  }
}
