import { Controller, Get, Param } from '@nestjs/common';
// import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
// import { User } from './interfaces';
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
}
