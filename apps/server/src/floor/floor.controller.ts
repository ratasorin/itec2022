import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FloorService } from './floor.service';

@Controller('floor')
export class FloorController {
  constructor(private floorService: FloorService) {}
  @Get('/:id/spaces')
  async spacesFromFloor(@Param('id') id: string) {
    return await this.floorService.getFloorSpaces(id);
  }

  @Get('/:building_id/:floor_level')
  async spacesFromLevel(
    @Param('building_id') building_id: string,
    @Param('floor_level', ParseIntPipe) floor_level: number
  ) {
    return await this.floorService.getLevelSpaces(building_id, floor_level);
  }
}
