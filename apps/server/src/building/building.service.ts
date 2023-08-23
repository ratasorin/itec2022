import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { BuildingStats, FloorDB } from '@shared';

@Injectable()
export class BuildingService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async getBuildings() {
    const result = await this.pool.query<BuildingStats>(`--sql
    WITH availability_rate AS (
      SELECT buildings.id as building_id,  100 - ((COUNT(bookings.interval) / COUNT(buildings.id)::float) * 100) AS availability_rate FROM buildings 
      LEFT JOIN floors ON floors.building_id = buildings.id 
      LEFT JOIN offices ON offices.floor_id = floors.id
      LEFT JOIN bookings ON bookings.office_id = offices.id AND bookings.interval @> current_timestamp
      GROUP BY buildings.id
    )
    SELECT buildings.name AS building_name, AVG(availability_rate.availability_rate) AS availability_rate, buildings.id AS building_id, AVG(building_ratings.stars)::int AS stars, COUNT(building_ratings.id) AS reviews FROM buildings
    LEFT JOIN building_ratings ON building_ratings.building_id = buildings.id
    LEFT JOIN availability_rate ON availability_rate.building_id = buildings.id
    GROUP BY buildings.id, buildings.name;
    `);
    const buildings = result.rows;
    return buildings;
  }

  async createBuilding(user_id: string, name: string) {
    await this.pool.query(
      `--sql
      INSERT INTO buildings (id, name, user_id) VALUES (DEFAULT, $1, $2); 
    `,
      [name, user_id]
    );
  }

  async getFloors(building_id: string) {
    const result = await this.pool.query<FloorDB>(
      `SELECT * FROM floors WHERE floors.building_id = $1`,
      [building_id]
    );
    const floors = result.rows;
    return floors;
  }
}
