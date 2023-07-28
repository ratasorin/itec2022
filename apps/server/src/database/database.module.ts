import { Module } from '@nestjs/common';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useFactory: async () =>
        new Pool({
          user: process.env.DATABASE_USER as string,
          host: process.env.DATABASE_HOST as string,
          database: process.env.DATABASE as string,
          password: process.env.DATABASE_PASSWORD as string,
          port: Number(process.env.DATABASE_PORT as string),
          connectionTimeoutMillis: 10000,
        }),
    },
  ],
  exports: ['CONNECTION'],
})
export class DatabaseModule {}
