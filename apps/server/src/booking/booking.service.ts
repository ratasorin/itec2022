import { Injectable, Inject } from '@nestjs/common';
import { OfficeTimeIntervalDB } from '@shared';
import { BookingDTO } from './DTO';
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

  async unverifiedBookSpace(
    { book_from, book_until, space_id }: BookingDTO,
    user_id: string
  ) {
    const response = await this.pool.query<{ id: string }>(
      `INSERT INTO unverified_bookings (id, interval, space_id, user_id) 
      VALUES (DEFAULT, tsrange(date_bin('30 minutes', date_trunc('minute', CAST($1 AS timestamp)), CAST(TO_TIMESTAMP(0) AS timestamp)), date_bin('30 minutes', date_trunc('minute', CAST($2 AS timestamp)), CAST(TO_TIMESTAMP(0) AS timestamp))), $3, $4) RETURNING id`,
      [book_from, book_until, space_id, user_id]
    );

    const { id } = response.rows[0];
    return id;
  }

  async bookSpace(unverified_id: string) {
    const response = await this.pool.query<{ id: string }>(
      `INSERT INTO bookings (interval, space_id, user_id)
      SELECT interval, space_id, user_id FROM unverified_bookings
      WHERE unverified_bookings.id = $1`,
      [unverified_id]
    );

    const booking = response.rows[0];
    return booking;
  }
}
