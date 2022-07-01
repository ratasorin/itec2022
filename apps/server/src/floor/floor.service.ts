import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { SpacesOnFloor } from '@shared';
import { FloorDB } from '@shared';

@Injectable()
export class FloorService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}
  async getSpacesByFloorID(floor_id: string) {
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
  async getSpacesByFloorLevel(building_id: string, floor_level: number) {
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

  async createFloor(previous_floor_id: string | null, building_id: string) {
    const response = await this.pool.query<FloorDB>(
      `--sql
        WITH inserted AS (
          INSERT INTO floors (id, previous_floor_id, building_id)
          VALUES 
          (DEFAULT, $1, $2) RETURNING id, building_id
        )
        INSERT into floors SELECT floors.id ,inserted.id, $2 FROM inserted LEFT JOIN floors ON floors.previous_floor_id IS NOT DISTINCT FROM $1 WHERE floors.id IS NOT NULL
        ON CONFLICT (id) DO UPDATE SET previous_floor_id = EXCLUDED.previous_floor_id
        RETURNING *
      `,
      [previous_floor_id, building_id]
    );

    const floor = response.rows[0];
    return floor;
  }

  async deleteFloor(floor_id: string) {
    const response = await this.pool.query<FloorDB>(
      `--sql
      WITH deleted AS (
        DELETE FROM floors WHERE floors.id = $1 RETURNING previous_floor_id
      )
      UPDATE floors SET previous_floor_id = deleted.previous_floor_id FROM deleted WHERE floors.previous_floor_id = $1  
    `,
      [floor_id]
    );

    const floor = await response.rows[0];
    return floor;
  }

  async updateFloor(floor_id: string, previous_floor_id: string | null) {
    console.log({ previous_floor_id });
    const response = await this.pool.query<FloorDB>(
      `--sql
        UPDATE floors SET previous_floor_id = f.id 
        FROM (
          VALUES 
            ($1, (SELECT id FROM floors WHERE previous_floor_id IS NOT DISTINCT FROM $2)),
            ($2, $1),
            ((SELECT previous_floor_id FROM floors WHERE id = $1), (SELECT id FROM floors WHERE previous_floor_id = $1))
        )
        AS f (id, condition)
        WHERE f.condition IS NOT NULL AND floors.id = f.condition 
      `,

      [floor_id, previous_floor_id]
    );

    const floor = response.rows;
    console.log({ floor });
    return floor;
  }

  async deleteAllFloors(building_id: string) {
    const response = await this.pool.query(
      `--sql
      DELETE FROM floors WHERE floors.building_id = $1 RETURNING *
    `,
      [building_id]
    );

    const floors = response.rows;
    return floors;
  }
}
