import { Inject, Injectable } from '@nestjs/common';
import { Floor } from '../../generated/schema';
import { Pool } from 'pg';
import { SpacesOnFloor } from '../user/interfaces';

@Injectable()
export class FloorService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}
  async getFloorSpaces(floor_id: string) {
    const result = await this.pool.query<SpacesOnFloor>(
      `--sql
        SELECT spaces.id AS space_id, x, y, users.name AS "occupantName", upper(interval) AS booked_until, spaces.name AS "officeName" FROM spaces
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
  async getLevelSpaces(building_id: string, floor_level: number) {
    const result = await this.pool.query<SpacesOnFloor>(
      `--sql
        SELECT spaces.id AS space_id, x, y, users.name AS "occupantName", upper(interval) AS booked_until, spaces.name AS "officeName" FROM spaces
        LEFT JOIN floors ON floors.id = spaces.floor_id
        LEFT JOIN bookings ON bookings.space_id = spaces.id AND bookings.interval @> localtimestamp
        LEFT JOIN users ON bookings.user_id = users.id
        WHERE floors.building_id = $1 AND floors.level = $2
        ORDER BY space_id;
      `,
      [building_id, floor_level]
    );

    const bookingsForFloor = result.rows;
    return bookingsForFloor;
  }
}
