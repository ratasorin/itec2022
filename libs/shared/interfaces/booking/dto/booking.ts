import { Booking as PrismaBooking } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class Booking implements PrismaBooking {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  book_from: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  book_until: Date;

  id: number;

  @IsNumber()
  @IsNotEmpty()
  space_id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
