import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BuildingService } from './building.service';
import { JwtUser } from '@shared';

@Controller('building')
export class BuildingController {
  constructor(private buildingsService: BuildingService) {}
  @Get()
  async getAllBuildings() {
    return await this.buildingsService.getBuildings();
  }

  @Get(':building_id/floors')
  async getFloors(@Param('building_id') building_id: string) {
    return await this.buildingsService.getFloors(building_id);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createBuilding(
    @Body('name') name: string,
    @Body('user') user: JwtUser
  ) {
    return await this.buildingsService.createBuilding(user.id, name);
  }
}
