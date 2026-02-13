DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles 
      WHERE  rolname = 'app_user') THEN
      CREATE ROLE app_user WITH LOGIN PASSWORD 'password_super_secreta_y_dificil';
   END IF;
END
$do$;

GRANT CONNECT ON DATABASE superbowl_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT ON view_1_sales_by_category TO app_user;
GRANT SELECT ON view_2_vip_fans TO app_user;
GRANT SELECT ON view_3_inventory_risk TO app_user;
GRANT SELECT ON view_4_price_performance TO app_user;
GRANT SELECT ON view_5_sales_running_total TO app_user;