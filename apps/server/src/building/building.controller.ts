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
  async createBuilding(@Body('name') name: string, @Request() req) {
    return await this.buildingsService.createBuilding(req.user.id, name);
  }
}
