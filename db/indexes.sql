-- 1. Optimiza el JOIN entre Usuarios y Órdenes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- 2. Optimiza el JOIN entre Categorías y Productos
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- 3. Optimiza las agrupaciones por fecha
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 4. Optimiza búsquedas rápidas de fans por equipo
CREATE INDEX IF NOT EXISTS idx_users_team ON users(team_preference);