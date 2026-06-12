-- Schema for the Postgres course examples (Lessons 03–07).
-- A small e-commerce model: users, products, orders, order_items.
-- Runs automatically on first container start (mounted into docker-entrypoint-initdb.d).

CREATE TABLE IF NOT EXISTS users (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text NOT NULL,
    email       text UNIQUE NOT NULL,
    is_active   boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
    id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku     text UNIQUE NOT NULL,
    name    text NOT NULL,
    price   numeric(10,2) NOT NULL CHECK (price >= 0),
    stock   integer NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

CREATE TABLE IF NOT EXISTS orders (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total       numeric(10,2) NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- Many-to-many between orders and products, with point-in-time price captured.
CREATE TABLE IF NOT EXISTS order_items (
    order_id    bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  bigint NOT NULL REFERENCES products(id),
    quantity    integer NOT NULL CHECK (quantity > 0),
    unit_price  numeric(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

-- Index foreign-key / frequently-filtered columns (Lesson 05).
CREATE INDEX IF NOT EXISTS idx_orders_user_id    ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items (product_id);
