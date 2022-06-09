import { Controller, Get, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Controller('test')
export class TestController {
  constructor(@Inject('CONNECTION') private connection: Pool) {}
  @Get('pg')
  async testPGNode() {
    return await this.connection.query(`--sql
        SELECT * FROM users
    `);
  }
}
