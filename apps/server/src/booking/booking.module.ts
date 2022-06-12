import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [DatabaseModule],
})
export class BookingModule {}
