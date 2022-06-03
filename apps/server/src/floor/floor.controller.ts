import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FloorService } from './floor.service';

@Controller('floor')
export class FloorController {
  constructor(private floorService: FloorService) {}
  @Get(':id')
  getSpaces(@Param('id', ParseIntPipe) id: number) {
    return this.floorService.getSpaces(id);
  }
}
