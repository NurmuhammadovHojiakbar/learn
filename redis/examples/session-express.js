// Express sessions stored in Redis (Lesson 10).
// Sessions are shared across all app instances and survive restarts.
//
//   node session-express.js   then visit http://localhost:3000
import express from 'express';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import client from './redisClient.js';

const app = express();

app.use(session({
  store: new RedisStore({ client, prefix: 'sess:' }),
  secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1 hour
}));

// Count visits per session to prove the session persists in Redis.
app.get('/', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.json({ views: req.session.views, sessionId: req.sessionID });
});

// Health check using PING.
app.get('/health', async (req, res) => {
  try { await client.ping(); res.json({ redis: 'ok' }); }
  catch { res.status(503).json({ redis: 'down' }); }
});

const server = app.listen(3000, () => {
  console.log('🚀 http://localhost:3000  (refresh to increment session views)');
  console.log('   Inspect keys:  redis-cli --scan --pattern "sess:*"');
});

// Graceful shutdown.
async function shutdown() {
  server.close();
  await client.quit();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
