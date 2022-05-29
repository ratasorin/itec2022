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
import { add } from 'date-fns';
@Controller('booking')
export class BookingController {
  constructor(private service: BookingService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('available/:id')
  async availableTimeframes(
    @Param('id', ParseIntPipe) id: number,
    @Body('end') end: Date
  ) {
    console.log({ id, end });
    if (!end)
      return await this.service.getAvailableTimeframes(
        id,
        add(new Date(), { hours: 12 })
      );
  }

  // @UseGuards(JwtAuthGuard)
  @Post('availability/:id')
  async availability(
    @Param('id', ParseIntPipe) id: number,
    @Body('end') end: Date
  ) {
    console.log({ end });
    if (!end)
      return await this.service.availability(
        id,
        add(new Date(), { hours: 12 })
      );
    return await this.service.availability(id, end);
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async bookSpace(@Body() input: Booking) {
    return await this.service.bookSpace(input);
  }
}
