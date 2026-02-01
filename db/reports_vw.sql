-- VISTA 1: Ventas por Categoría
CREATE OR REPLACE VIEW vw_sales_by_category AS
SELECT 
    c.name AS categoria,
    COUNT(od.id) AS total_items_vendidos,
    SUM(od.subtotal) AS ventas_totales,
    ROUND(SUM(od.subtotal) / NULLIF(COUNT(od.id), 0), 2) AS ticket_promedio
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN order_details od ON p.id = od.product_id
GROUP BY c.id, c.name;

-- VISTA 2: Ranking VIP
CREATE OR REPLACE VIEW vw_vip_fans AS
SELECT 
    u.id AS usuario_id,
    u.name AS fan,
    u.team_preference AS equipo,
    SUM(o.total) AS gasto_total,
    DENSE_RANK() OVER (ORDER BY SUM(o.total) DESC) AS ranking_vip,
    CASE 
        WHEN SUM(o.total) > 10000 THEN 'Legendary Fan'
        WHEN SUM(o.total) > 1000 THEN 'Super Fan'
        ELSE 'Rookie'
    END AS nivel_lealtad
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'pagado'
GROUP BY u.id, u.name, u.team_preference, u.email
HAVING SUM(o.total) > 0;

-- VISTA 3: Inventario
CREATE OR REPLACE VIEW vw_inventory_analysis AS
WITH InventoryValue AS (
    SELECT p.id, p.name, p.stock, p.price, (p.stock * p.price) AS valor_stock_actual
    FROM products p
)
SELECT 
    iv.name AS producto,
    iv.stock,
    COALESCE(iv.price, 0) AS precio_unitario,
    COALESCE(iv.valor_stock_actual, 0) AS dinero_en_bodega,
    CASE 
        WHEN iv.stock < 10 THEN 'Crítico'
        WHEN iv.stock < 50 THEN 'Bajo'
        ELSE 'Suficiente'
    END AS estado_stock
FROM InventoryValue iv;