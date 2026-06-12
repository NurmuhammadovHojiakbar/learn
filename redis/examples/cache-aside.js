// Cache-aside pattern demo (Lesson 05).
// Run a slow "database" lookup, cache the result in Redis with a TTL, and show that
// the second call is served from cache.
//
//   node cache-aside.js
import client from './redisClient.js';

// Fake database with artificial latency.
const fakeDb = {
  async findUser(id) {
    await new Promise((r) => setTimeout(r, 200)); // simulate 200ms query
    return { id, name: `User ${id}`, fetchedAt: new Date().toISOString() };
  },
};

async function getUser(id) {
  const key = `user:${id}`;

  // 1. Try cache
  const cached = await client.get(key);
  if (cached) {
    return { source: 'cache', user: JSON.parse(cached) };
  }

  // 2. Miss -> load from DB
  const user = await fakeDb.findUser(id);

  // 3. Populate cache with a jittered TTL (30s ± 5s) to avoid synchronized expiry
  const ttl = 30 + Math.floor(Math.random() * 10);
  await client.set(key, JSON.stringify(user), { EX: ttl });

  return { source: 'database', user };
}

async function main() {
  console.time('1st call (miss)');
  console.log(await getUser(1000));
  console.timeEnd('1st call (miss)');

  console.time('2nd call (hit)');
  console.log(await getUser(1000));
  console.timeEnd('2nd call (hit)');

  await client.quit();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
