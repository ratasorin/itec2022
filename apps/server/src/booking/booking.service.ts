import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { OfficeTimeIntervalDB } from './interfaces';
import { BookingDTO } from './interfaces/Booking';
import { Pool } from 'pg';

@Injectable()
export class BookingService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async getTimetable(space_id: string) {
    const response = await this.pool.query<OfficeTimeIntervalDB>(
      `SELECT GREATEST(lower(interval), localtimestamp) AS booked_from, 
      upper(interval) AS booked_until, 
      upper(interval) AS free_from, 
      lower(lead(interval) OVER (ORDER BY bookings.interval)) AS free_until,
      users.name AS "occupantName" 
      FROM bookings 
      LEFT JOIN spaces ON bookings.space_id = spaces.id
      LEFT JOIN users ON bookings.user_id = users.id
      WHERE spaces.id = $1 AND upper(interval) >= localtimestamp
      `,
      [space_id]
    );

    const bookings = response.rows;

    return bookings;
  }

  async bookSpace({ book_from, space_id, book_until, user_id }: BookingDTO) {
    const response = await this.pool.query<{ id: string }>(
      `INSERT INTO bookings (id, interval, space_id, user_id) 
      VALUES (DEFAULT, tsrange(date_bin('30 minutes', date_trunc("minute", $1), CAST(TO_TIMESTAMP(0) AS timestamp)), date_bin('30 minutes', date_trunc("minute", $2), CAST(TO_TIMESTAMP(0) AS timestamp))), $3, $4) RETURNING id`,
      [book_from, book_until, space_id, user_id]
    );

    const booking = response.rows[0];
    return booking;
  }
}
