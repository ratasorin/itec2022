import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { User } from '../../generated/schema';
import { UserDTO } from '../user/interfaces';
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
  async login(@Body('user') user: User) {
    return this.authService.login(user);
  }

  @Post('signup')
  async signUp(@Body() user: UserDTO) {
    return this.authService.signUp(user);
  }
}
