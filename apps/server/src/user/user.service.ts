import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { UserDTO } from './DTO';
import { UserDB } from '@shared';

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
      `INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *`,
      [name, password, email]
    );
    const user = response.rows[0];
    return user;
  }

  async getBuildingsOwnedByUser(user_id: string): Promise<{}> {}
}
