import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SECRET } from '../constant/jwt';
import { User } from '../../user/interfaces';
import { JwtUser } from '../interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: SECRET,
    });
  }

  // for jwt-strategy passport verifies the JWT signature
  // and decodes the JSON. It inkoves validate() passing the
  // decoded JSON as the payload.
  async validate(payload: JwtUser) {
    const { name } = payload;
    const user = await this.prisma.user.findFirst({
      where: {
        name,
      },
    });
    return user;
  }
}
