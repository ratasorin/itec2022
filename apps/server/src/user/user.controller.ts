import { Controller, Get, Param } from '@nestjs/common';
// import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
// import { User } from './interfaces';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.service.getUser(id);
    return user;
  }
}
