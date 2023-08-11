import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { BuildingStats, FloorDB } from '@shared';

@Injectable()
export class BuildingService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async getBuildings() {
    const result = await this.pool.query<BuildingStats[]>(`--sql
      SELECT buildings.name, buildings.id,  100 - ((COUNT(bookings.interval) / COUNT(*)::float) * 100) AS availability_rate, AVG(building_ratings.stars) AS stars FROM buildings 
      LEFT JOIN floors ON floors.building_id = buildings.id 
      LEFT JOIN spaces ON spaces.floor_id = floors.id
      LEFT JOIN bookings ON bookings.space_id = spaces.id AND bookings.interval @> current_timestamp
      LEFT JOIN building_ratings ON building_ratings.building_id = buildings.id
      GROUP BY buildings.name, buildings.id
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
