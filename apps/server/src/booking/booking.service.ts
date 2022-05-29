import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Booking, Timeframe } from './interfaces';

type Overlaps = {
  overlaps: number;
}[];

type Intervals = {
  book_from: string;
  book_until: string;
}[];

const sanitizeInterval = (
  interval: [Date, Date],
  limits: [Date, Date]
): [Date, Date] => {
  if (interval[1] > limits[1]) return [interval[0], limits[1]];
  if (interval[0] < limits[0]) return [limits[0], interval[1]];

  return interval;
};

const findAvailableTimeframes = (
  limits: [Date, Date],
  bookedIntervals: [Date, Date][]
): [Date, Date][] => {
  if (!bookedIntervals.length) return [];
  if (limits[0] < bookedIntervals[0][0] && limits[0] < bookedIntervals[0][1]) {
    return [
      [limits[0], bookedIntervals[0][0]],
      ...findAvailableTimeframes(
        [bookedIntervals[0][0], limits[1]],
        bookedIntervals
      ),
    ];
  }
  if (limits[0] >= bookedIntervals[0][0] && limits[0] < bookedIntervals[0][1]) {
    return [
      [
        bookedIntervals[0][1],
        bookedIntervals[1] ? bookedIntervals[1][0] : limits[1],
      ],
      ...findAvailableTimeframes(
        [bookedIntervals[1] ? bookedIntervals[1][0] : limits[1], limits[1]],
        bookedIntervals.slice(1)
      ),
    ];
  }
  return [];
};

const allTimeframes = (
  limits: [Date, Date],
  bookedIntervals: [Date, Date][]
): [Date, Date][] => {
  if (!bookedIntervals.length) return [];
  if (limits[0] < bookedIntervals[0][0] && limits[0] < bookedIntervals[0][1])
    return [
      [limits[0], bookedIntervals[0][0]],
      ...allTimeframes([bookedIntervals[0][0], limits[1]], bookedIntervals),
    ];

  if (limits[0] >= bookedIntervals[0][0] && limits[0] < bookedIntervals[0][1])
    return [
      sanitizeInterval(bookedIntervals[0], limits),
      [
        bookedIntervals[0][1],
        bookedIntervals[1] ? bookedIntervals[1][0] : limits[1],
      ],
      ...findAvailableTimeframes(
        [bookedIntervals[1] ? bookedIntervals[1][0] : limits[1], limits[1]],
        bookedIntervals.slice(1)
      ),
    ];
  return [];
};

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  // TODO: If there are no bookins, return that the spots are available, not just empty []
  async getAvailableTimeframes(space_id: number, end: Date) {
    const start = new Date();

    const bookedTimeframes = await this.prisma.$queryRaw<Intervals>`
      SELECT book_from, book_until FROM bookings
      WHERE space_id = ${space_id}
      AND 
      (book_until BETWEEN ${start} AND ${end} OR book_from BETWEEN ${start} AND ${end})
      ORDER BY book_from;
    `;

    if (!bookedTimeframes.length) return [start, end];

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

  async availability(space_id: number, end: Date) {
    const start = new Date();
    const bookedTimeframes = await this.prisma.$queryRaw<Intervals>`
      SELECT book_from, book_until FROM bookings
      WHERE space_id = ${space_id}
      AND (book_until BETWEEN ${start} AND ${end}
      OR book_from BETWEEN ${start} AND ${end})
    `;

    if (!bookedTimeframes.length) return [start, end];

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
        AND (book_from BETWEEN ${start} AND ${end}
        OR book_until BETWEEN ${start} AND ${end})
        `;
      return !overlaps;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
  async bookSpace({ book_from, space_id, book_until, user_id }: Booking) {
    try {
      const isAvailable = await this.isAvalibleSpace(
        { start: book_from, end: book_until },
        space_id
      );
      if (!isAvailable)
        throw new Error(
          `SPACE ${space_id} is booked from ${book_from} until ${book_until}`
        );
      return this.prisma.booking.create({
        data: {
          book_from,
          book_until,
          space_id,
          user_id,
        },
      });
    } catch (err) {
      return {
        err: `SPACE ${space_id} is booked from ${book_from.toLocaleTimeString()} until ${book_until.toLocaleTimeString()}`,
      };
    }
  }
}
