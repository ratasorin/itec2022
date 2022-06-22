import { Inject, Injectable } from '@nestjs/common';
import { Building as BuildingDB } from '../../generated/schema';
import { Pool } from 'pg';
import { FloorDB } from './interfaces';

@Injectable()
export class BuildingService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async getBuildings() {
    const result = await this.pool.query<BuildingDB>(`SELECT * FROM buildings`);
    const buildings = result.rows;
    return buildings;
  }

  async getFloors(building_id: string) {
    const result = await this.pool.query<FloorDB>(`SELECT * FROM floors WHERE floors.building_id = $1`, [building_id]);
    const floors = result.rows;
    return floors;
  }
}
