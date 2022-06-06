import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Booking, Interval, Timeframe } from './interfaces';

type Overlaps = {
  overlaps: number;
}[];

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async getTimetable(space_id: number): Promise<Interval[]> {
    const now = new Date();
    const bookedTimeframes = await this.prisma.$queryRaw<Interval[]>`--sql 
      SELECT  GREATEST(book_from,${now}) AS start
            ,book_until                         AS end
            ,users.name
      FROM bookings
      LEFT JOIN users ON bookings.user_id = users.id
      WHERE space_id = ${space_id}
      AND book_until > ${now}
    `;

    if (!bookedTimeframes.length)
      return [{ start: now, end: null, name: null }];

    const freeTimeframes = bookedTimeframes.map(({ end }, index) => {
      const { start: nextStart } = bookedTimeframes[index + 1] || {
        start: null,
      };

      return {
        start: end,
        end: nextStart,
        name: null,
      } as Interval;
    });

    const timeframes = [...bookedTimeframes, ...freeTimeframes].sort((a, b) =>
      new Date(a.start).getTime() > new Date(b.start).getTime() ? 1 : -1
    );

    console.log({ bookedTimeframes }, { freeTimeframes });

    if (
      now.getTime() !==
      new Date((timeframes[0] || { start: now }).start).getTime()
    )
      return [
        {
          start: now,
          end: timeframes[0].start,
          name: null,
        } as Interval,
        ...timeframes,
      ];

    return timeframes;
  }

  async isAvalibleSpace({ start, end }: Timeframe, id: number) {
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
