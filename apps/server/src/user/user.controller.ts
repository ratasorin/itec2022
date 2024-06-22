import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req) {
    return await this.service.getUserBy(req.user.id);
  }

  @Get('buildings')
  @UseGuards(JwtAuthGuard)
  async getBuildingsOwnedByUser(@Request() req) {
    const buildings = await this.service.getBuildingsOwnedByUser(req.user.id);
    return buildings;
  }
}
