DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD 'nfl_pass_2026';
  ELSE
    ALTER ROLE app_user WITH PASSWORD 'nfl_pass_2026';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE "superbowl_db" TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_user;