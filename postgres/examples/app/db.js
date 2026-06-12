// Shared Postgres connection pool (Lesson 07).
// One pool per process; never open a connection per request.
import pg from 'pg';

const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:secret@localhost:5432/appdb',
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => console.error('Unexpected PG pool error', err));

// Convenience: run a one-off parameterized query.
export const query = (text, params) => pool.query(text, params);

export default pool;
