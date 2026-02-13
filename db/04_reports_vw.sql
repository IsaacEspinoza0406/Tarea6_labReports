-- ====================================================================================
-- VISTA 1: view_1_sales_by_category
-- Grain: Una fila por categoría de producto.
-- Métricas: Total de items vendidos (COUNT), Ingreso total (SUM), Ticket Promedio (AVG).
-- Lógica: JOIN entre categorías, productos y detalles de orden.
-- Verify Query: SELECT * FROM view_1_sales_by_category WHERE total_revenue > 0;
-- ====================================================================================
CREATE OR REPLACE VIEW view_1_sales_by_category AS
SELECT 
    c.name AS category_name,
    COUNT(od.id) AS total_items_sold,
    COALESCE(SUM(od.subtotal), 0) AS total_revenue,
    ROUND(AVG(od.subtotal / NULLIF(od.quantity, 0)), 2) AS avg_ticket_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
LEFT JOIN order_details od ON p.id = od.product_id
GROUP BY c.id, c.name;

-- ====================================================================================
-- VISTA 2: view_2_vip_fans
-- Grain: Una fila por usuario.
-- Métricas: Gasto total acumulado.
-- Lógica: Usa CASE para clasificar lealtad y HAVING para filtrar clientes sin compras.
-- Verify Query: SELECT * FROM view_2_vip_fans WHERE loyalty_level = 'Legendary';
-- ====================================================================================
CREATE OR REPLACE VIEW view_2_vip_fans AS
SELECT 
    u.id,
    u.name AS fan_name,
    u.email,
    SUM(o.total) AS total_spent,
    CASE 
        WHEN SUM(o.total) > 20000 THEN 'Legendary'
        WHEN SUM(o.total) BETWEEN 5000 AND 20000 THEN 'Pro'
        ELSE 'Rookie'
    END AS loyalty_level
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'pagado'
GROUP BY u.id, u.name, u.email
HAVING SUM(o.total) > 0;

-- ====================================================================================
-- VISTA 3: view_3_inventory_risk
-- Grain: Una fila por producto.
-- Métricas: Ingreso potencial (Stock * Precio).
-- Lógica: Campo calculado y CASE para alertas de stock bajo.
-- Verify Query: SELECT * FROM view_3_inventory_risk WHERE stock_status = 'CRITICAL LOW';
-- ====================================================================================
CREATE OR REPLACE VIEW view_3_inventory_risk AS
SELECT 
    p.name AS product_name,
    p.stock,
    p.price,
    (p.stock * p.price) AS potential_revenue,
    CASE 
        WHEN p.stock < 50 THEN 'CRITICAL LOW'
        WHEN p.stock < 150 THEN 'WARNING'
        ELSE 'OK'
    END AS stock_status
FROM products p;

-- ====================================================================================
-- VISTA 4: view_4_price_performance
-- Grain: Una fila por producto.
-- Métricas: Comparación de precio vs promedio global.
-- Lógica: Usa CTE (WITH) para calcular el promedio una sola vez.
-- Verify Query: SELECT * FROM view_4_price_performance LIMIT 5;
-- ====================================================================================
CREATE OR REPLACE VIEW view_4_price_performance AS
WITH AvgPriceCTE AS (
    SELECT AVG(total) as avg_order_value FROM orders WHERE status = 'pagado'
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

-- ====================================================================================
-- VISTA 5: view_5_sales_running_total
-- Grain: Una fila por orden.
-- Métricas: Suma acumulativa (Running Total).
-- Lógica: Window Function (SUM OVER ORDER BY) para ver el crecimiento de ventas.
-- Verify Query: SELECT * FROM view_5_sales_running_total ORDER BY created_at DESC;
-- ====================================================================================
CREATE OR REPLACE VIEW view_5_sales_running_total AS
SELECT 
    o.id AS order_id,
    o.created_at,
    o.total,
    SUM(o.total) OVER (ORDER BY o.created_at) AS running_total_revenue
FROM orders o
WHERE o.status = 'pagado';