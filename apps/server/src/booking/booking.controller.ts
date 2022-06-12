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
import { BookingDTO } from './interfaces/Booking';

@Controller('booking')
export class BookingController {
  constructor(private service: BookingService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('timetable/:id')
  async getTimetable(@Param('id') id: string) {
    return await this.service.getTimetable(id);
  }

  // @UseGuards(JwtAuthGuard)
  @UseFilters(HttpExceptionFilter)
  @Post()
  async bookSpace(@Body() input: BookingDTO) {
    return await this.service.bookSpace(input);
  }
}
