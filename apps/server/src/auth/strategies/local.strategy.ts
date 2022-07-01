import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDB } from '@shared';

// Passport's local authentication strategy
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // For the local-strategy Passports expects a username and a password
  // The user is returned so Passport can create the user property on Request
  async validate(email: string, password: string): Promise<UserDB> {
    const user = await this.authService.validateUser(email, password);
    if (!user)
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    return user;
  }
}
