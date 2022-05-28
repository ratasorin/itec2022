import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './interfaces';

@Controller('booking')
export class BookingController {
  constructor(private service: BookingService) {}

  @Get('available/:id')
  async availableTimeframes(
    @Param('id', ParseIntPipe) id: number,
    @Body('end') end: Date,
  ) {
    console.log({ id });
    return await this.service.availableTimeframes(id, end);
  }

  @Get('availability/:id')
  async availability(
    @Param('id', ParseIntPipe) id: number,
    @Body('end') end: Date,
  ) {
    return await this.service.availability(id, end);
  }
  @Post()
  async bookSpace(@Body() input: Booking) {
    const booking = await this.service.bookSpace(input);
    return booking;
  }
}
