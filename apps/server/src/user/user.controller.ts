import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  async createUser(@Body() input: User) {
    console.log({ input });
    const user = await this.service.createUser(input);
    console.log(user);
    return user;
  }
}
