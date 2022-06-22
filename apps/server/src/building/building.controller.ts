import { Controller, Get, Param } from '@nestjs/common';
import { BuildingService } from './building.service';

@Controller('building')
export class BuildingController {
  constructor(private buildingsService: BuildingService) {}
  @Get()
  async getAllBuilding() {
    return await this.buildingsService.getBuildings();
  }

  @Get(":building_id/floors")
  async getFloors(@Param("building_id") building_id: string) {
    return await this.buildingsService.getFloors(building_id);
  }
}
