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

  @Get('/timetable/:office_id')
  async getTimetable(@Param('office_id') office_id: string) {
    return await this.service.getTimetable(office_id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async unverifiedBookOffice(@Body() input: BookingDTO, @Request() req) {
    const user: JwtUser = req.user;
    if (!user.id)
      throw new HttpException(
        "The JWT doesn't contain a user, please log out and try again",
        500
      );

    return await this.service.unverifiedBookOffice(input, user.id);
  }

  @Get('/verify/:unverified_id')
  async bookOffice(@Param('unverified_id') unverified_id: string) {
    return this.service.bookOffice(unverified_id);
  }
}
