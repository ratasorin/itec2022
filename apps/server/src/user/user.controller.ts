import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtUser } from '@shared';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUser(@Body() attachedUser: JwtUser) {
    const user = await this.service.getUserBy(attachedUser.id);
    return user;
  }
}
