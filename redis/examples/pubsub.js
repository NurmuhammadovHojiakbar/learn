// Pub/Sub demo (Lesson 06).
// A subscriber needs its own connection, so we duplicate() the shared client.
//
//   node pubsub.js
import client from './redisClient.js';

async function main() {
  const subscriber = client.duplicate();
  await subscriber.connect();

  await subscriber.subscribe('news', (message, channel) => {
    const data = JSON.parse(message);
    console.log(`📨 [${channel}] ${data.title} @ ${data.ts}`);
  });

  // Publish a few messages from the main client.
  for (let i = 1; i <= 3; i++) {
    await client.publish('news', JSON.stringify({ title: `Update #${i}`, ts: Date.now() }));
    await new Promise((r) => setTimeout(r, 300));
  }

  // Give the subscriber a moment to receive, then clean up.
  await new Promise((r) => setTimeout(r, 500));
  await subscriber.unsubscribe('news');
  await subscriber.quit();
  await client.quit();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
