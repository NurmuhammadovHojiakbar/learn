// Atomic fixed-window rate limiter using a Lua script (Lesson 07 + 10).
// The script does INCR + EXPIRE atomically so concurrent requests can't race.
//
//   node rate-limiter.js
import client from './redisClient.js';

// INCR the key; on the first hit set the window TTL. Returns the current count.
const RATE_LIMIT_SCRIPT = `
  local current = redis.call('INCR', KEYS[1])
  if current == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
  end
  return current
`;

async function rateLimit(id, limit, windowSec) {
  const count = await client.eval(RATE_LIMIT_SCRIPT, {
    keys: [`rl:${id}`],
    arguments: [String(windowSec)],
  });
  return { allowed: count <= limit, count, remaining: Math.max(0, limit - count) };
}

async function main() {
  const limit = 5;
  const windowSec = 10;
  const user = 'user:1000';

  // Fire 7 requests; the first 5 are allowed, the rest are blocked.
  for (let i = 1; i <= 7; i++) {
    const res = await rateLimit(user, limit, windowSec);
    console.log(
      `req ${i}: ${res.allowed ? '✅ allowed' : '⛔ BLOCKED'} ` +
      `(count=${res.count}, remaining=${res.remaining})`
    );
  }

  await client.quit();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
