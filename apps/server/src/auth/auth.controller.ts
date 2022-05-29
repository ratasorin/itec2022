import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { User } from '../user/interfaces';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // This guard invokes the local Passport strategy:
  //                        - retrieving credentials
  //                        - running the validate() function
  //                        - create the user
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signIn(@Body() user: User) {
    return this.authService.signIn(user);
  }
}
