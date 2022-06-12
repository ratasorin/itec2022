import { Controller, Get, Param } from '@nestjs/common';
import { FloorService } from './floor.service';

@Controller('floor')
export class FloorController {
  constructor(private floorService: FloorService) {}
  @Get('/:id/spaces')
  async getSpaces(@Param('id') id: string) {
    return await this.floorService.getSpaces(id);
  }

  @Get('all/:building_id')
  async getFloors(@Param('building_id') building_id: string) {
    return await this.floorService.getFloors(building_id);
  }
}
