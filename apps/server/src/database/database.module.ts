import { Module } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useFactory: async () => {
        const ca = (
          await readFile('apps/server/database/aws-ca.pem')
        ).toString();
        if (!ca)
          throw new Error(
            "Certificate Authority missing, please visit https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html and download a valid certificate and save it in the database folder as: 'aws-ca.pem'"
          );
        const pool = new Pool({
          user: process.env.DATABASE_USER as string,
          host: process.env.DATABASE_HOST as string,
          database: process.env.DATABASE as string,
          password: process.env.DATABASE_PASSWORD as string,
          port: Number(process.env.DATABASE_PORT as string),
          connectionTimeoutMillis: 10000,
          ssl: {
            rejectUnauthorized: true,
            ca,
          },
        });

        try {
          const client = await pool.connect();
          client.release();
          return pool;
        } catch (error) {
          throw new Error('DATABASE NOT CONNECTED' + String(error));
        }
      },
    },
  ],
  exports: ['CONNECTION'],
})
export class DatabaseModule {}
