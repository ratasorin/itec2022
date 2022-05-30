import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingService } from './booking.service';
import { Booking } from './interfaces';
@Controller('booking')
export class BookingController {
  constructor(private service: BookingService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('available/:id')
  async getAvailableTimeframes(
    @Param('id', ParseIntPipe) id: number,
    @Body('end') end: Date
  ) {
    return await this.service.getAvailableTimeframes(id, end);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('timetable/:id')
  async getTimetable(
    @Param('id', ParseIntPipe) id: number,
    @Body('end') end: Date
  ) {
    return await this.service.getTimetable(id, end);
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async bookSpace(@Body() input: Booking) {
    return await this.service.bookSpace(input);
  }
}
