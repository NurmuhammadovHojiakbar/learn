// Shared Redis client used by all examples.
// One long-lived client per process — never open a new connection per request.
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    // Reconnect with backoff, capped at 2s. Return an Error to stop trying.
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
  },
});

// ALWAYS attach an error listener — otherwise errors crash the process.
client.on('error', (err) => console.error('Redis Client Error:', err.message));
client.on('ready', () => console.log('✅ Redis ready'));

await client.connect();

export default client;
