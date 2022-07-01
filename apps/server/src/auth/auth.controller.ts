import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { UserDTO } from '../user/DTO';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signUp(@Body() user: UserDTO) {
    return this.authService.signUp(user);
  }
}
