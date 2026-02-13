echo "--- 1. Verificando que existan las 5 Vistas ---"
docker exec postgres_nfl_recu psql -U app_user -d superbowl_db -c "\dv"

echo "--- 2. Prueba Vista 1 (Ventas) ---"
docker exec postgres_nfl_recu psql -U app_user -d superbowl_db -c "SELECT * FROM view_1_sales_by_category LIMIT 2;"

echo "--- 3. Prueba Vista 2 (VIP Fans) ---"
docker exec postgres_nfl_recu psql -U app_user -d superbowl_db -c "SELECT * FROM view_2_vip_fans LIMIT 2;"

echo "--- 4. Prueba Vista 3 (Inventario) ---"
docker exec postgres_nfl_recu psql -U app_user -d superbowl_db -c "SELECT * FROM view_3_inventory_risk LIMIT 2;"

echo "--- 5. Prueba Vista 4 (Precios CTE) ---"
docker exec postgres_nfl_recu psql -U app_user -d superbowl_db -c "SELECT * FROM view_4_price_performance LIMIT 2;"

echo "--- 6. Prueba Vista 5 (Acumulado Mensual) ---"
docker exec postgres_nfl_recu psql -U app_user -d superbowl_db -c "SELECT * FROM view_5_sales_running_total LIMIT 2;"

echo "--- DONE ---"