import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { SpacesOnFloor } from '@shared';
import { FloorDB } from '@shared';
import { FloorUpdateDTO } from './DTO';

@Injectable()
export class FloorService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}
  async getSpacesByFloorID(floor_id: string) {
    const result = await this.pool.query<SpacesOnFloor>(
      `--sql
        SELECT spaces.id AS space_id, x, y, users.name AS "occupantName", upper(interval) AS booked_until, spaces.name AS "officeName" FROM spaces
        LEFT JOIN floors ON floors.id = spaces.floor_id
        LEFT JOIN bookings ON bookings.space_id = spaces.id AND bookings.interval @> current_timestamp
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
        LEFT JOIN bookings ON bookings.space_id = spaces.id AND bookings.interval @> current_timestamp
        LEFT JOIN users ON bookings.user_id = users.id
        WHERE floors.building_id = $1 AND floors.level = $2
        ORDER BY space_id;
      `,
      [building_id, floor_level]
    );

    const bookingsForFloor = result.rows;
    return bookingsForFloor;
  }

  async createFloor(building_id: string) {
    const response = await this.pool.query<{ id: string }>(
      `--sql
        INSERT INTO floors(building_id) VALUES ($1) RETURNING floors.id;
      `,
      [building_id]
    );

    const { id } = response.rows[0];
    return id;
  }

  async deleteFloor(floor_id: string) {
    const response = await this.pool.query<FloorDB>(
      `--sql DELETE FROM floors WHERE id = $1 RETURNING *;`,
      [floor_id]
    );

    const floor = response.rows[0];
    return floor;
  }

  async updateFloors(floors: FloorUpdateDTO[]) {
    const response = await this.pool.query<FloorDB>(
      `--sql
        UPDATE floors SET level = updated_floors.level 
        FROM $1 as updated_floors
        WHERE floors.id = updated_floors.id;
      `,

      [floors]
    );

    const floor = response.rows;

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
