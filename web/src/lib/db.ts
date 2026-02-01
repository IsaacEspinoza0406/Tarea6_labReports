import { Pool } from 'pg';

const conn = new Pool({
  user: 'postgres',             
  password: 'touchdown123',     
  host: 'localhost',
  port: 5433,
  database: 'superbowl_db',
});

export const pool = conn;