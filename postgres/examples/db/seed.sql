-- Seed data for the Postgres course examples.
-- Loaded after schema.sql (filenames run in alphabetical order by the init scripts).

INSERT INTO users (name, email) VALUES
    ('Ada Lovelace',  'ada@example.com'),
    ('Linus Torvalds','linus@example.com'),
    ('Grace Hopper',  'grace@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (sku, name, price, stock) VALUES
    ('KB-001', 'Mechanical Keyboard', 89.99, 50),
    ('MS-002', 'Wireless Mouse',      39.99, 100),
    ('MON-003','27-inch Monitor',     249.99, 20),
    ('USB-004','USB-C Hub',           29.99, 0)     -- out of stock, to test the stock check
ON CONFLICT (sku) DO NOTHING;

-- A sample order for Ada (user 1) buying a keyboard + mouse.
INSERT INTO orders (user_id, total) VALUES (1, 129.98);
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 89.99),
    (1, 2, 1, 39.99)
ON CONFLICT DO NOTHING;
