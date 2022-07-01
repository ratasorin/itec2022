import {
  Body,
  Controller,
  Get,
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

  @Get('timetable/:space_id')
  async getTimetable(@Param('space_id') space_id: string) {
    return await this.service.getTimetable(space_id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async unverifiedBookSpace(@Body() input: BookingDTO, @Request() req) {
    console.log(req.user);

    const user: JwtUser = req.user;
    if (!user.id) return 'NO USER PROVIDED';
    const id = await this.service.unverifiedBookSpace(input, user.id);
    await this.mailService.sendMailTo(user.email, id);
  }

  @Get('/:unverified_id')
  async bookSpace(@Param('unverified_id') unverified_id: string) {
    return this.service.bookSpace(unverified_id);
  }
}
