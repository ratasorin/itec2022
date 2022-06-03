import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BuildingService } from './building.service';

@Controller('building')
export class BuildingController {
  constructor(private BuildingService: BuildingService) {}
  @Get()
  async getAllBuilding() {
    return await this.BuildingService.getAllBuilding();
  }
}
