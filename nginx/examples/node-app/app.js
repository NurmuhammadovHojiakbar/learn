// Minimal Express + Redis API, proxied by Nginx in this example stack.
// Nginx forwards /api/ here; the app increments a Redis counter to prove the
// Nginx -> Node -> Redis chain works end to end.
import express from 'express';
import { createClient } from 'redis';

const app = express();
app.set('trust proxy', true);   // honor X-Forwarded-* headers from Nginx
const PORT = process.env.PORT || 3000;

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.on('error', (err) => console.error('Redis error:', err.message));
await redis.connect();

// Mounted at /api/ by Nginx (proxy keeps the /api prefix).
app.get('/api/', async (req, res) => {
  const hits = await redis.incr('hits');
  res.json({ message: 'Hello via Nginx reverse proxy!', hits, clientIp: req.ip });
});

app.get('/api/health', async (req, res) => {
  try { await redis.ping(); res.json({ status: 'ok' }); }
  catch { res.status(503).json({ status: 'redis down' }); }
});

const server = app.listen(PORT, () => console.log(`api listening on :${PORT}`));

async function shutdown() { server.close(); await redis.quit(); process.exit(0); }
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
