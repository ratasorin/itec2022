import { Inject, Injectable } from '@nestjs/common';
import { Building as BuildingDB } from '../../generated/schema';
import { Pool } from 'pg';

@Injectable()
export class BuildingService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async getBuildings() {
    const result = await this.pool.query<BuildingDB>(`SELECT * FROM buildings`);

    const buildings = result.rows;

    return buildings;
  }
}
