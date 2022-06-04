import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import allTimeframes from '../utils/booking/findAllTimeframes';
import findAvailableTimeframes from '../utils/booking/findAvailableTimeframes';
import { Booking, Timeframe } from './interfaces';

type Overlaps = {
  overlaps: number;
}[];

type Intervals = {
  book_from: string;
  book_until: string;
}[];

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async getAvailableTimeframes(space_id: number, end: Date) {
    const start = new Date();
    const bookedTimeframes = await this.prisma.$queryRaw<Intervals>`
      SELECT book_from, book_until FROM bookings
      WHERE space_id = ${space_id}
      AND 
      (book_until BETWEEN ${start} AND ${end} OR book_from BETWEEN ${start} AND ${end})
      ORDER BY book_from;
    `;

    if (!bookedTimeframes.length) return [[start, end]];

    const bookedIntervals = bookedTimeframes.map(
      ({ book_from, book_until }) =>
        [new Date(book_from), new Date(book_until)] as [Date, Date]
    );

    const availableTimeframes = findAvailableTimeframes(
      [start, end],
      bookedIntervals
    );

    return availableTimeframes;
  }

  async getTimetable(space_id: number, end: Date) {
    const start = new Date();
    const bookedTimeframes = await this.prisma.$queryRaw<Intervals>`
      SELECT book_from, book_until FROM bookings
      WHERE space_id = ${space_id}
      AND 
      (book_until BETWEEN ${start} AND ${end} OR book_from BETWEEN ${start} AND ${end})
    `;

    if (!bookedTimeframes.length) return [[start, end]];

    const bookedIntervals = bookedTimeframes.map(
      ({ book_from, book_until }) =>
        [new Date(book_from), new Date(book_until)] as [Date, Date]
    );
    const timeframes = allTimeframes([start, end], bookedIntervals);

    return timeframes;
  }

  async isAvalibleSpace({ start, end }: Timeframe, id: number) {
    try {
      const [{ overlaps }] = await this.prisma.$queryRaw<Overlaps>`
        SELECT COUNT(*) AS overlaps FROM bookings
        WHERE space_id = ${id} 
        AND 
        (book_from BETWEEN ${start} AND ${end} OR book_until BETWEEN ${start} AND ${end})
        `;
      return !overlaps;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
  async bookSpace({ book_from, space_id, book_until, user_id }: Booking) {
    const isAvailable = await this.isAvalibleSpace(
      { start: book_from, end: book_until },
      space_id
    );
    if (!isAvailable)
      throw new HttpException(
        'SPACE ALREADY BOOKED',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    console.log('IM BOOKING', { book_from, book_until });
    await this.prisma.booking.create({
      data: {
        book_from,
        book_until,
        space_id,
        user_id,
      },
    });

    return `Succesfully booked from ${book_from.toLocaleTimeString()} to ${book_until.toLocaleTimeString()}`;
  }
}
