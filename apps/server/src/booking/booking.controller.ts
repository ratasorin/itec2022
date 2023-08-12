import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MailService } from '../mail/mail.service';
import { BookingService } from './booking.service';
import { JwtUser } from '@shared';
import { BookingDTO } from './DTO';

@Controller('booking')
export class BookingController {
  constructor(
    private service: BookingService,
    private mailService: MailService
  ) {}

  @Get('/timetable/:space_id')
  async getTimetable(@Param('space_id') space_id: string) {
    return await this.service.getTimetable(space_id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async unverifiedBookSpace(@Body() input: BookingDTO, @Request() req) {
    const user: JwtUser = req.user;
    if (!user.id)
      throw new HttpException(
        "The JWT doesn't contain a user, please log out and try again",
        500
      );

    return await this.service.unverifiedBookSpace(input, user.id);
  }

  @Get('/verify/:unverified_id')
  async bookSpace(@Param('unverified_id') unverified_id: string) {
    return this.service.bookSpace(unverified_id);
  }
}
