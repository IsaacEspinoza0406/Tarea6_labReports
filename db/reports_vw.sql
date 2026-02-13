-- Vista 1. Resumen de Ventas.
CREATE OR REPLACE VIEW view_1_sales_by_category AS
SELECT 
    c.name AS category_name,
    COUNT(oi.id) AS total_items_sold,
    COALESCE(SUM(oi.price_at_purchase), 0) AS total_revenue,
    ROUND(AVG(oi.price_at_purchase), 2) AS avg_ticket_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY c.id, c.name;

-- Vista 2. Ranking VIP.
CREATE OR REPLACE VIEW view_2_vip_fans AS
SELECT 
    u.id,
    u.name AS fan_name,
    u.email,
    SUM(o.total) AS total_spent,
    CASE 
        WHEN SUM(o.total) > 1000 THEN 'Legendary'
        WHEN SUM(o.total) BETWEEN 500 AND 1000 THEN 'Pro'
        ELSE 'Rookie'
    END AS loyalty_level
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email
HAVING SUM(o.total) > 0;

-- Vista 3. Riesgo de Inventario.
CREATE OR REPLACE VIEW view_3_inventory_risk AS
SELECT 
    p.name AS product_name,
    p.stock,
    p.price,
    (p.stock * p.price) AS potential_revenue,
    CASE 
        WHEN p.stock < 10 THEN 'CRITICAL LOW'
        WHEN p.stock < 50 THEN 'WARNING'
        ELSE 'OK'
    END AS stock_status
FROM products p;

-- Vista 4. Comparativa de Precios.
CREATE OR REPLACE VIEW view_4_price_performance AS
WITH AvgPriceCTE AS (
    SELECT AVG(total) as avg_order_value FROM orders
)
SELECT 
    p.name,
    p.price,
    ROUND((SELECT avg_order_value FROM AvgPriceCTE), 2) as global_avg_order,
    CASE 
        WHEN p.price > (SELECT avg_order_value FROM AvgPriceCTE) THEN 'High Ticket'
        ELSE 'Low Ticket'
    END as performance_check
FROM products p;

-- Vista 5. Tendencia de Ventas.
CREATE OR REPLACE VIEW view_5_sales_running_total AS
SELECT 
    o.id AS order_id,
    o.created_at,
    o.total,
    SUM(o.total) OVER (ORDER BY o.created_at) AS running_total_revenue
FROM orders o
WHERE o.status = 'paid';