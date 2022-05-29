import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BuildingsService } from './buildings.service';

@Controller('buildings')
export class BuildingsController {
  constructor(private buildingsService: BuildingsService) {}
  @Get()
  async getAllBuildings() {
    return await this.buildingsService.getAllBuildings();
  }

  @Get(':building_id/floor/:id')
  async getAllSpacesOnFloor(
    @Param('building_id', ParseIntPipe) building_id: number,
    @Param('id', ParseIntPipe) id: number
  ) {
    console.log({ building_id, id });
    return this.buildingsService.getSpacesOnLevel(building_id, id);
  }
}
