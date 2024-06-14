import { Pool } from 'pg';
import { readFile } from 'fs/promises';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { exec } from 'child_process';

const path = join(process.cwd(), 'apps', 'server', 'src', '.env');
dotenv.config({ path });

const generateSchema = async () => {
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

  const command = `schemats postgres postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}?sslmode=require"&"sslrootcert=./apps/server/database/global-bundle.pem -o ./schema.ts -s public --no-throw-on-missing-type`;
  console.log(command);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
};

generateSchema().then();
