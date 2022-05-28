import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { User } from './interfaces';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get(':name')
  async getUser(@Param('name') name: string) {
    const user = await this.service.getUser(name);
    console.log(user);
    return user;
  }

  @Post()
  @UseGuards(LocalAuthGuard)
  async createUser(@Body() input: User) {
    const user = await this.service.createUser(input);
    return user;
  }
}
