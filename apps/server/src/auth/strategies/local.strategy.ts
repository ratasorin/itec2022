import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
export const LOCAL_STRATEGY = 'LOCAL_STRATEGY';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
  constructor(private authService: AuthService) {
    // if the request is not formatted like this:
    /**
     * {
     *  "email": "...",
     *  "password: "..."
     * }
     */
    // it will throw a 401 Unauthorized error!
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user)
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);

    return user;
  }
}
