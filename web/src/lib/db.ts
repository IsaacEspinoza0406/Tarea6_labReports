import { Pool } from 'pg';

const conn = new Pool({
  user: 'app_user',             
  password: 'nfl_pass_2026',   
  host: 'localhost',
  port: 5433,                   
  database: 'superbowl_db',
});

export const pool = conn;