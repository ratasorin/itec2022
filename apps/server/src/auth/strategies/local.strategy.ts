import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

// Passport's local authentication strategy
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // For the local-strategy Passports expects a username and a password
  // The user is returned so Passport can create the user property on Request
  async validate(email: string, password: string): Promise<boolean> {
    const user = await this.authService.validateUser(email, password);
    return !!user;
  }
}
