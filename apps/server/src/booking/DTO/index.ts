import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class BookingDTO {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  book_from: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  book_until: Date;

  @IsString()
  @IsNotEmpty()
  space_id: string;
}
