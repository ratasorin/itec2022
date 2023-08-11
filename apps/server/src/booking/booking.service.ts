import { Injectable, Inject } from '@nestjs/common';
import { OfficeTimeIntervalAPI, OfficeTimeIntervalDB } from '@shared';
import { BookingDTO } from './DTO';
import { Pool } from 'pg';

@Injectable()
export class BookingService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async getTimetable(space_id: string) {
    const response = await this.pool.query<OfficeTimeIntervalDB>(
      `--sql
      SELECT UPPER(interval) AS booked_until, LOWER(interval) AS booked_from, users.name AS occupant_name
      FROM bookings 
      LEFT JOIN spaces ON bookings.space_id = spaces.id
      LEFT JOIN users ON bookings.user_id = users.id
      WHERE spaces.id = $1 AND upper(interval) >= current_timestamp
      ORDER BY booked_from ASC;
      `,
      [space_id]
    );

    const bookings = response.rows;
    const firstBooking = bookings[0];
    const currentTimestamp = new Date();
    let firstIntervalBooked =
      currentTimestamp >= new Date(firstBooking.booked_from) &&
      currentTimestamp <= new Date(firstBooking.booked_until);

    const intervals = [] as OfficeTimeIntervalAPI[];
    for (let i = 0; i < bookings.length; i++) {
      const currentBooking = bookings[i];
      const nextBooking = i < bookings.length - 1 ? bookings[i + 1] : null;
      const previousBooking = i !== 0 ? bookings[i - 1] : null;
      if (firstIntervalBooked)
        intervals.push(
          {
            booked_from: currentBooking.booked_from,
            booked_until: currentBooking.booked_until,
            occupantName: currentBooking.occupant_name,
            free_from: null,
            free_until: null,
          },
          {
            booked_from: null,
            booked_until: null,
            free_from: currentBooking.booked_until,
            free_until: nextBooking?.booked_from || '',
            occupantName: null,
          }
        );
      else
        intervals.push(
          {
            free_from:
              previousBooking?.booked_until || currentTimestamp.toISOString(),
            free_until: currentBooking.booked_from,
            booked_from: null,
            booked_until: null,
            occupantName: null,
          },
          {
            booked_from: currentBooking.booked_from,
            booked_until: currentBooking.booked_until,
            occupantName: currentBooking.occupant_name,
            free_from: null,
            free_until: null,
          }
        );
    }
    if (!firstIntervalBooked)
      intervals.push({
        free_from: bookings[bookings.length - 1].booked_until,
        free_until: '',
        booked_from: null,
        booked_until: null,
        occupantName: null,
      });

    return intervals;
  }

  async unverifiedBookSpace(
    { book_from, book_until, space_id }: BookingDTO,
    user_id: string
  ) {
    const response = await this.pool.query<{ id: string }>(
      `--sql
      INSERT 
        INTO unverified_bookings 
          (id, interval, space_id, user_id) 
        VALUES 
          (
            DEFAULT, 
            tstzrange(date_bin('30 minutes', date_trunc('minute', CAST($1 AS timestamp with time zone), TO_TIMESTAMP(0))), date_bin('30 minutes', date_trunc('minute', CAST($2 AS timestamp with time zone), TO_TIMESTAMP(0)))), 
            $3, 
            $4
          ) 
        RETURNING id`,
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
