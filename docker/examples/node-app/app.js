// Tiny Express app used by the Docker course examples.
// It connects to Redis (by the service/container name) to demonstrate container networking.
import express from 'express';
import { createClient } from 'redis';

const app = express();
const PORT = process.env.PORT || 3000;

// In Docker/Compose, the host is the SERVICE NAME ("redis"), not localhost.
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.on('error', (err) => console.error('Redis error:', err.message));
await redis.connect();

// Count visits in Redis to prove cross-container state works.
app.get('/', async (req, res) => {
  const visits = await redis.incr('visits');
  res.json({ message: 'Hello from Docker!', visits });
});

// Healthcheck endpoint used by Docker HEALTHCHECK / Compose.
app.get('/health', async (req, res) => {
  try {
    await redis.ping();
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'redis down' });
  }
});

const server = app.listen(PORT, () => console.log(`listening on :${PORT}`));

// Graceful shutdown so `docker stop` (SIGTERM) exits cleanly.
async function shutdown() {
  server.close();
  await redis.quit();
  process.exit(0);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
