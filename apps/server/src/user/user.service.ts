import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { UserDTO } from './DTO';
import { UserDB, i_BuildingOwnedByUser } from '@shared';

@Injectable()
export class UserService {
  constructor(@Inject('CONNECTION') private pool: Pool) {}

  async authenticateUser(
    email: string,
    password: string
  ): Promise<UserDB | null> {
    const response = await this.pool.query<UserDB>(
      `SELECT id, name, email FROM users WHERE email = $1 AND password = $2`,
      [email, password]
    );
    const user = response.rows[0];
    return user;
  }

  async getUserBy(id: string): Promise<UserDB | null> {
    const response = await this.pool.query<UserDB>(
      `SELECT id, name FROM users WHERE id = $1`,
      [id]
    );
    const user = response.rows[0];
    return user;
  }

  async createUser({ name, password, email }: UserDTO): Promise<UserDB> {
    const response = await this.pool.query<UserDB>(
      `INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING id, name, email`,
      [name, password, email]
    );
    const user = response.rows[0];
    return user;
  }

  async getBuildingsOwnedByUser(
    user_id: string
  ): Promise<i_BuildingOwnedByUser[]> {
    // Display:
    // 1. the total number of bookings made for each building
    // 2. the ratings of the building
    const response = await this.pool.query(
      `--sql
      SELECT buildings.*, COUNT(bookings.id) as bookings_count, COUNT((lower(bookings.interval) > current_timestamp OR upper(bookings.interval) > current_timestamp) OR NULL) as active_bookings_count, SUM(building_ratings.stars)/COUNT(building_ratings.id) as avg_rating FROM buildings 
      LEFT JOIN users ON users.id = buildings.user_id 
      LEFT JOIN building_ratings ON building_ratings.building_id = buildings.id
      LEFT JOIN floors ON floors.building_id = buildings.id 
      LEFT JOIN offices ON offices.floor_id = floors.id 
      LEFT JOIN bookings ON bookings.office_id = offices.id
      WHERE users.id = $1
      GROUP BY buildings.id;
      `,
      [user_id]
    );
    const buildingsOwnedByUser = response.rows as i_BuildingOwnedByUser[];

    return buildingsOwnedByUser;
  }
}
