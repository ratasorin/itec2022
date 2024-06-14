import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'CONNECTION',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const ca = (
          await readFile('apps/server/database/global-bundle.pem')
        ).toString();
        if (!ca)
          throw new Error(
            "Certificate Authority missing, please visit https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html and download a valid certificate and save it in the database folder as: 'aws-ca.pem'"
          );

        // debugging
        console.log('CONNECTION SETTINGS: ', {
          user: configService.get('DATABASE_USER') as string,
          host: configService.get('DATABASE_HOST') as string,
          database: configService.get('DATABASE') as string,
          password: configService.get('DATABASE_PASSWORD') as string,
          port: configService.get('DATABASE_PORT') as number,
        });

        const pool = new Pool({
          user: configService.get('DATABASE_USER') as string,
          host: configService.get('DATABASE_HOST') as string,
          database: configService.get('DATABASE') as string,
          password: configService.get('DATABASE_PASSWORD') as string,
          port: configService.get('DATABASE_PORT') as number,
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
          throw new Error('DATABASE NOT CONNECTED: ' + String(error));
        }
      },
    },
  ],
  exports: ['CONNECTION'],
})
export class DatabaseModule {}
