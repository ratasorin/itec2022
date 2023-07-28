import { Client } from 'pg';
import { readFile } from 'fs/promises';

const seed = async () => {
  const sql = (await readFile('./schema.sql')).toString();
  const client = new Client({
    user: 'postgres',
    host: 'desk-booking.czqorgurl6oh.eu-central-1.rds.amazonaws.com',
    database: 'desk-booking',
    password: 'SorinLikesNadira132005',
    port: 5432,
    connectionTimeoutMillis: 10000,
  });

  await client.connect();
  await client.query(sql);
};

seed().then();
