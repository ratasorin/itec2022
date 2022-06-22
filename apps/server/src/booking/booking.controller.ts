import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from '../error/http-exception.filter';
import { BookingService } from './booking.service';
import { BookingDTO } from './interfaces/booking';

@Controller('booking')
export class BookingController {
  constructor(private service: BookingService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('timetable/:space_id')
  async getTimetable(@Param('space_id') space_id: string) {
    return await this.service.getTimetable(space_id);
  }

  // @UseGuards(JwtAuthGuard)
  @UseFilters(HttpExceptionFilter)
  @Post()
  async bookSpace(@Body() input: BookingDTO) {
    return await this.service.bookSpace(input);
  }
}
