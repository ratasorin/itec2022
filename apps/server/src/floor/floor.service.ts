import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { OfficesOnFloor } from '@shared';
import { FloorDB } from '@shared';
import { FloorUpdateDTO } from './DTO';

@Injectable()
export class FloorService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}
  async getOfficesByFloorId(floorId: string) {
    const result = await this.pool.query<OfficesOnFloor>(
      `--sql
      WITH max_booked_block AS (
        WITH RECURSIVE block_booking(booking_id, user_id, booked_until, office_id) AS (
          SELECT bookings.id as booking_id, users.id as user_id, upper(bookings.interval) as booked_until, offices.id AS office_id FROM offices
          LEFT JOIN bookings ON bookings.office_id = offices.id AND bookings.interval @> current_timestamp
          LEFT JOIN users ON bookings.user_id = users.id
          
          UNION ALL 
          
          SELECT current_booking.id AS booking_id, users.id AS user_id, upper(current_booking.interval) as booked_until, offices.id AS office_id FROM block_booking AS previous_booking, bookings AS current_booking
          LEFT JOIN offices ON offices.id = current_booking.office_id
          LEFT JOIN users ON current_booking.user_id = users.id 
          WHERE previous_booking.booked_until = lower(current_booking.interval)
        )
        SELECT block_booking.office_id, MAX(block_booking.booked_until) AS booked_until FROM block_booking 
        GROUP BY block_booking.office_id
    )
      SELECT max_booked_block.office_id, max_booked_block.booked_until, offices.name AS "officeName", users.name AS "occupantName", x, y FROM offices
      LEFT JOIN max_booked_block ON offices.id = max_booked_block.office_id
      LEFT JOIN floors ON floors.id = offices.floor_id
      LEFT JOIN bookings ON bookings.office_id = offices.id AND upper(bookings.interval) = max_booked_block.booked_until
      LEFT JOIN users ON bookings.user_id = users.id
      WHERE floors.id = $1
      ORDER BY max_booked_block.booked_until ASC
      `,
      [floorId]
    );

    const bookingsForFloor = result.rows;
    return bookingsForFloor;
  }

  async getOfficesByFloorLevel(building_id: string, floor_level: number) {
    const officesOnFloorResult = await this.pool.query<OfficesOnFloor>(
      `--sql
      WITH max_booked_block AS (
        WITH RECURSIVE block_booking(booking_id, user_id, booked_until, office_id) AS (
          SELECT bookings.id as booking_id, users.id as user_id, upper(bookings.interval) as booked_until, offices.id AS office_id FROM offices
          LEFT JOIN bookings ON bookings.office_id = offices.id AND bookings.interval @> current_timestamp
          LEFT JOIN users ON bookings.user_id = users.id
          
          UNION ALL 
          
          SELECT current_booking.id AS booking_id, users.id AS user_id, upper(current_booking.interval) as booked_until, offices.id AS office_id FROM block_booking AS previous_booking, bookings AS current_booking
          LEFT JOIN offices ON offices.id = current_booking.office_id
          LEFT JOIN users ON current_booking.user_id = users.id 
          WHERE previous_booking.booked_until = lower(current_booking.interval)
        )
        SELECT block_booking.office_id, MAX(block_booking.booked_until) AS booked_until FROM block_booking 
        GROUP BY block_booking.office_id
      )
      SELECT max_booked_block.office_id, max_booked_block.booked_until, offices.name AS "officeName", users.name AS "occupantName", x, y FROM offices
      LEFT JOIN max_booked_block ON offices.id = max_booked_block.office_id
      LEFT JOIN floors ON floors.id = offices.floor_id
      LEFT JOIN buildings ON buildings.id = floors.building_id
      LEFT JOIN bookings ON bookings.office_id = offices.id AND upper(bookings.interval) = max_booked_block.booked_until
      LEFT JOIN users ON bookings.user_id = users.id
      WHERE buildings.id = $1 AND floors.level = $2
      ORDER BY max_booked_block.booked_until ASC
      `,
      [building_id, floor_level]
    );

    const officesOnFloor = officesOnFloorResult.rows;

    return officesOnFloor;
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
