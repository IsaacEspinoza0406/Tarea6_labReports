-- 1. Optimiza el JOIN entre Usuarios y Órdenes.
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- 2. Optimiza el JOIN entre Categorías y Productos.
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- 3. Optimiza la Window Function por fecha.
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 4. Optimiza el filtro WHERE status = 'pagado'.
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 5. Optimiza el JOIN pesado de detalles.
CREATE INDEX IF NOT EXISTS idx_order_details_product_id ON order_details(product_id);