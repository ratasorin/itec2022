import { Injectable, Inject } from '@nestjs/common';
import { OfficeTimeIntervalAPI, OfficeTimeIntervalDB } from '@shared';
import { BookingDTO } from './DTO';
import { Pool } from 'pg';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { compile } from 'handlebars';
import { MailService } from '../mail/mail.service';

@Injectable()
export class BookingService {
  constructor(
    @Inject('CONNECTION') private pool: Pool,
    private mailService: MailService
  ) {}

  async getTimetable(office_id: string) {
    const response = await this.pool.query<OfficeTimeIntervalDB>(
      `--sql
      SELECT LOWER(interval) AS booked_from, UPPER(interval) AS booked_until, users.name AS occupant_name
      FROM bookings 
      LEFT JOIN offices ON bookings.office_id = offices.id
      LEFT JOIN users ON bookings.user_id = users.id
      WHERE offices.id = $1 AND upper(interval) >= current_timestamp
      ORDER BY booked_from ASC;
      `,
      [office_id]
    );

    const bookings = response.rows;

    const firstBooking = bookings[0];

    if (!firstBooking) return [];

    const currentTimestamp = new Date();
    let firstIntervalBooked =
      currentTimestamp >= new Date(firstBooking.booked_from) &&
      currentTimestamp <= new Date(firstBooking.booked_until);

    const intervals = [] as OfficeTimeIntervalAPI[];
    if (!firstIntervalBooked)
      intervals.push({
        booked_from: null,
        booked_until: null,
        occupantName: null,
        free_from: new Date().toISOString(),
        free_until: bookings[0].booked_from,
      });
    for (let i = 0; i < bookings.length; i++) {
      const currentBooking = bookings[i];
      const nextBooking = bookings[i + 1];

      intervals.push({
        booked_from: currentBooking.booked_from,
        booked_until: currentBooking.booked_until,
        free_from: null,
        free_until: null,
        occupantName: currentBooking.occupant_name,
      });

      if (currentBooking.booked_until !== nextBooking?.booked_from)
        intervals.push({
          free_from: currentBooking.booked_until,
          free_until: nextBooking ? nextBooking.booked_from : '',
          booked_from: null,
          booked_until: null,
          occupantName: null,
        });
    }
    return intervals;
  }

  async unverifiedBookOffice(
    { book_from, book_until, office_id }: BookingDTO,
    user_id: string
  ) {
    const unverifiedBookingResponse = await this.pool.query<{ id: string }>(
      `--sql
      INSERT 
        INTO unverified_bookings 
          (id, interval, office_id, user_id) 
        VALUES 
          (
            DEFAULT, 
            tstzrange(
              date_bin(
                '30 minutes', 
                date_trunc('minute', CAST($1 AS timestamp with time zone)),
                TO_TIMESTAMP(0)
              ), 
              date_bin(
                '30 minutes', 
                date_trunc('minute', CAST($2 AS timestamp with time zone)),
                TO_TIMESTAMP(0)
              )
            ), 
            $3, 
            $4
          ) 
        RETURNING id`,
      [book_from, book_until, office_id, user_id]
    );
    const { id: unverifiedId } = unverifiedBookingResponse.rows[0];

    const userResponse = await this.pool.query<{ name: string; email: string }>(
      `--sql
       SELECT name, email FROM users WHERE id = $1
      `,
      [user_id]
    );

    const { name, email } = userResponse.rows[0];

    const confirmationTemplateSource = await readFile(
      join(
        cwd(),
        'apps',
        'server',
        'src',
        'mail',
        'templates',
        'confirmation.hbs'
      ),
      'utf8'
    );

    const confirmationTemplate = compile(confirmationTemplateSource);
    const confirmationHTML = confirmationTemplate({
      name,
      url: `http://localhost:3000/booking/verify/${unverifiedId}`,
    });

    await this.mailService.sendMailTo(
      email,
      'Verify Booking',
      confirmationHTML
    );

    return {
      message: 'Email confirmation sent at ' + email,
    };
  }

  async bookOffice(unverified_id: string) {
    const response = await this.pool.query<{ id: string }>(
      `INSERT INTO bookings (interval, office_id, user_id)
      SELECT interval, office_id, user_id FROM unverified_bookings
      WHERE unverified_bookings.id = $1`,
      [unverified_id]
    );

    const booking = response.rows[0];

    return booking;
  }
}
