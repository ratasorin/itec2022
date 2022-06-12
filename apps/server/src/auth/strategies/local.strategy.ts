import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User as UserDB } from '../../../generated/schema';

// Passport's local authentication strategy
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // For the local-strategy Passports expects a username and a password
  // The user is returned so Passport can create the user property on Request
  async validate(username: string, password: string): Promise<UserDB> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
