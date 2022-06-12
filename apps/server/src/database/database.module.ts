import { Module } from '@nestjs/common';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useFactory: async () =>
        new Pool({
          user: 'postgres',
          host: 'localhost',
          database: 'itec',
          password: 'postgres',
          port: 5432,
          connectionTimeoutMillis: 10000,
        }),
    },
  ],
  exports: ['CONNECTION'],
})
export class DatabaseModule {}
