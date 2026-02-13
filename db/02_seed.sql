-- Limpieza inicial.
TRUNCATE order_details, orders, products, categories, users RESTART IDENTITY CASCADE;

-- Insertar Categorías.
INSERT INTO categories (name) VALUES 
('Boletos Super Bowl'), ('Merch Chiefs'), ('Merch 49ers'), ('Alimentos Estadio'), ('Experiencias VIP');

-- Insertar Usuarios.
INSERT INTO users (name, email, team_preference) VALUES
('Patrick Mahomes', 'pat@chiefs.com', 'Chiefs'),
('Taylor Swift', 'taylor@music.com', 'Chiefs'),
('Joe Montana', 'joe@legend.com', '49ers'),
('Fan Casual', 'fan@nfl.com', 'Neutral'),
('Brock Purdy Dad', 'mrpurdy@49ers.com', '49ers');

-- Insertar Productos.
INSERT INTO products (name, price, stock, category_id) VALUES
('Boleto General (Gradas)', 2500.00, 500, 1),
('Boleto Palco VIP', 15000.00, 20, 1),
('Jersey Mahomes #15 Rojo', 150.00, 100, 2),
('Gorra Super Bowl LVIII Chiefs', 45.00, 200, 2),
('Jersey Purdy #13 Blanco', 140.00, 100, 3),
('Casco Mini 49ers', 35.00, 150, 3),
('Cerveza Estadio 1L', 18.00, 5000, 4),
('Hot Dog Gigante', 12.00, 3000, 4),
('Pase de Campo Pre-Juego', 500.00, 50, 5);


INSERT INTO orders (user_id, total, status, created_at) VALUES (2, 30300.00, 'pagado', '2026-02-10 10:00:00');
INSERT INTO orders (user_id, total, status, created_at) VALUES (1, 45.00, 'pagado', NOW() - INTERVAL '2 days');
INSERT INTO orders (user_id, total, status, created_at) VALUES (3, 140.00, 'pagado', NOW() - INTERVAL '1 day');

-- Detalles Orden 1.
INSERT INTO order_details (order_id, product_id, quantity, subtotal) VALUES (1, 2, 2, 30000.00), (1, 3, 2, 300.00);
-- Detalles Orden 2.
INSERT INTO order_details (order_id, product_id, quantity, subtotal) VALUES (2, 4, 1, 45.00);
-- Detalles Orden 3.
INSERT INTO order_details (order_id, product_id, quantity, subtotal) VALUES (3, 5, 1, 140.00);