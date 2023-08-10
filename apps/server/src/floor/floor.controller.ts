import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FloorDTO, FloorUpdateDTO } from './DTO';
import { FloorService } from './floor.service';

@Controller('floor')
export class FloorController {
  constructor(private floorService: FloorService) {}
  @Get('/:id/spaces')
  async spacesFromFloor(@Param('id') id: string) {
    return await this.floorService.getSpacesByFloorID(id);
  }

  @Get('/:building_id/:floor_level')
  async spacesFromLevel(
    @Param('building_id') building_id: string,
    @Param('floor_level', ParseIntPipe) floor_level: number
  ) {
    return await this.floorService.getSpacesByFloorLevel(
      building_id,
      floor_level
    );
  }

  @Post('/:building_id')
  @UseGuards(JwtAuthGuard)
  async createFloor(
    @Param('building_id') building_id: string,
    @Body() floor: FloorDTO
  ) {
    return await this.floorService.createFloor(building_id);
  }

  @Delete('/:floor_id')
  @UseGuards(JwtAuthGuard)
  async deleteFloor(@Param('floor_id') floor_id: string) {
    return await this.floorService.deleteFloor(floor_id);
  }

  @Delete('/all/:building_id')
  async deleteAllFLoors(@Param('building_id') building_id: string) {
    return await this.floorService.deleteAllFloors(building_id);
  }

  @Put('/update')
  // @UseGuards(JwtAuthGuard)
  async updateFloors(@Body() floors: FloorUpdateDTO[]) {
    return await this.floorService.updateFloors(floors);
  }
}
