// Fully instrumented Express app for the Observability course:
//   - structured logging (pino) with per-request correlation IDs   (Lesson 02)
//   - Prometheus metrics (prom-client) at /metrics                  (Lesson 03)
//   - tracing is added separately via tracing.js + --import         (Lesson 07)
import express from 'express';
import { randomUUID } from 'crypto';
import pino from 'pino';
import client from 'prom-client';
import { createClient } from 'redis';

const app = express();
const PORT = process.env.PORT || 3000;
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// --- Redis (gives us auto-instrumented spans + a demo counter) ---
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.on('error', (err) => logger.error({ err }, 'redis error'));
await redis.connect();

// --- Prometheus metrics (Lesson 03) ---
const register = new client.Registry();
register.setDefaultLabels({ app: 'orders-api' });
client.collectDefaultMetrics({ register });   // CPU, memory, event-loop lag, GC...

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});
const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});
const inFlight = new client.Gauge({
  name: 'http_requests_in_flight',
  help: 'In-flight HTTP requests',
  registers: [register],
});

// --- Correlation ID + request logging (Lesson 02) ---
app.use((req, res, next) => {
  const reqId = req.headers['x-request-id'] || randomUUID();
  req.log = logger.child({ reqId });
  res.setHeader('x-request-id', reqId);
  next();
});

// --- Metrics middleware (Lesson 03) ---
app.use((req, res, next) => {
  inFlight.inc();
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path || req.path; // route template, NOT the raw URL
    const labels = { method: req.method, route, status: res.statusCode };
    httpRequests.inc(labels);
    end(labels);
    inFlight.dec();
    req.log.info({ ...labels }, 'request completed');
  });
  next();
});

// --- Routes ---
app.get('/api/', async (req, res) => {
  const hits = await redis.incr('hits');
  req.log.info({ hits }, 'served api root');
  res.json({ message: 'observable!', hits });
});

// Demo endpoint that is sometimes slow and sometimes errors — for dashboards/alerts/traces.
app.get('/api/flaky', async (req, res) => {
  await new Promise((r) => setTimeout(r, Math.random() * 400));   // variable latency
  if (Math.random() < 0.1) {
    req.log.error('flaky endpoint failed');
    return res.status(500).json({ error: 'random failure' });
  }
  res.json({ ok: true });
});

// Prometheus scrape endpoint (Lesson 03).
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Liveness for orchestrators.
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

const server = app.listen(PORT, () => logger.info({ port: PORT }, 'server started'));

async function shutdown() { server.close(); await redis.quit(); process.exit(0); }
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
