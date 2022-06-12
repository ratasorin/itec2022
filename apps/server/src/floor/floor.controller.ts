import { Controller, Get, Param } from '@nestjs/common';
import { FloorService } from './floor.service';

@Controller('floor')
export class FloorController {
  constructor(private floorService: FloorService) {}
  @Get(':id')
  getSpaces(@Param('id') id: string) {
    return this.floorService.getSpaces(id);
  }
}
