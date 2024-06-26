import { Pool } from 'pg';
import { readFile } from 'fs/promises';
import * as dotenv from 'dotenv';
import { join } from 'path';

const path = join(process.cwd(), 'apps', 'server', 'src', '.env');
dotenv.config({ path });

const seed = async () => {
  const sql = (await readFile('apps/server/database/schema.sql')).toString();
  if (!sql)
    throw new Error(
      'Missing sql seed file! The sql file should be named: "schema.sql"'
    );

  const ca = (
    await readFile('apps/server/database/global-bundle.pem')
  ).toString();
  if (!ca)
    throw new Error(
      "Certificate Authority missing, please visit https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html, download a valid certificate and save it in the database folder as: 'aws-ca.pem'"
    );

  if (
    !process.env.DATABASE_USER ||
    !process.env.DATABASE_HOST ||
    !process.env.DATABASE ||
    !process.env.DATABASE_PASSWORD ||
    !process.env.DATABASE_PORT
  )
    throw new Error('Database credentials missing!');

  const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    ssl: {
      rejectUnauthorized: true,
      ca,
    },
  });

  await pool.query(sql);
  await pool.end();
};

seed().then();
