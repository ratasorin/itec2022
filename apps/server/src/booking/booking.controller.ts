import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from '../error/http-exception.filter';
import { BookingService } from './booking.service';
import { Booking } from './interfaces/booking';

@Controller('booking')
export class BookingController {
  constructor(private service: BookingService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('timetable/:id')
  async getTimetable(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getTimetable(id);
  }

  // @UseGuards(JwtAuthGuard)
  @UseFilters(HttpExceptionFilter)
  @Post()
  async bookSpace(@Body() input: Booking) {
    return await this.service.bookSpace(input);
  }
}
