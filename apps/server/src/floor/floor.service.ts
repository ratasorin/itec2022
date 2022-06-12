import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { SpacesOnLevel } from '../user/interfaces';

@Injectable()
export class FloorService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}
  async getSpaces(floor_id: string) {
    const result = await this.pool.query<SpacesOnLevel>(
      `--sql
        SELECT spaces.id AS space_id, x, y, users.name, upper(interval) AS booked_until FROM spaces
        LEFT JOIN floors ON floors.id = spaces.floor_id
        LEFT JOIN bookings ON bookings.space_id = spaces.id AND bookings.interval @> localtimestamp
        LEFT JOIN users ON bookings.user_id = users.id
        WHERE floors.id = $1
        ORDER BY space_id;
      `,
      [floor_id]
    );

    const bookingsForFloor = result.rows;
    return bookingsForFloor;
  }
}
