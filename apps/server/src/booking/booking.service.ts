import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  OfficeTimeInterval,
  OfficeTimeIntervalDB,
  UserDefinedOfficeTimeInterval,
} from './interfaces';
import { parseDBOfficeIntervals } from '@shared';
import { TimeInterval } from './interfaces/timeframe';
import { Booking } from './interfaces/booking';

type Overlaps = {
  overlaps: number;
}[];

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async getTimetable(
    space_id: number
  ): Promise<UserDefinedOfficeTimeInterval[]> {
    const now = new Date();
    const bookedIntervalsDB = await this.prisma.$queryRaw<
      OfficeTimeIntervalDB[]
    >`--sql 
      SELECT  GREATEST(book_from,${now}) AS start
            ,book_until                  AS end
            ,users.name                  AS "occupantName"
      FROM bookings
      LEFT JOIN users ON bookings.user_id = users.id
      WHERE space_id = ${space_id}
      AND book_until > ${now}
    `;

    const bookedIntervals = parseDBOfficeIntervals(bookedIntervalsDB);

    if (!bookedIntervals.length)
      return [
        {
          start: now,
          end: null,
          occupantName: null,
        },
      ];

    const freeIntervals: UserDefinedOfficeTimeInterval[] = bookedIntervals.map(
      ({ end }, index) => {
        const nextBookedInterval: OfficeTimeInterval | undefined =
          bookedIntervals[index + 1];

        if (!nextBookedInterval)
          return {
            start: end,
            end: null,
            occupantName: null,
          };

        return {
          start: end,
          end: nextBookedInterval.start,
          occupantName: null,
        };
      }
    );

    const timeIntervals = [...bookedIntervals, ...freeIntervals].sort((a, b) =>
      a.start.getTime() > b.start.getTime() ? 1 : -1
    );

    if (now.getTime() !== timeIntervals[0].start.getTime())
      return [
        {
          start: now,
          end: new Date(timeIntervals[0].start),
          occupantName: null,
        },
        ...timeIntervals,
      ];

    return timeIntervals;
  }

  async isAvailableSpace({ start, end }: TimeInterval, id: number) {
    try {
      const [{ overlaps }] = await this.prisma.$queryRaw<Overlaps>`--sql
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
    const isAvailable = await this.isAvailableSpace(
      { start: book_from, end: book_until },
      space_id
    );
    if (!isAvailable)
      throw new HttpException(
        'SPACE ALREADY BOOKED',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    await this.prisma.booking.create({
      data: {
        book_from,
        book_until,
        space_id,
        user_id,
      },
    });

    return `Successfully booked from ${book_from.toLocaleTimeString()} to ${book_until.toLocaleTimeString()}`;
  }
}
