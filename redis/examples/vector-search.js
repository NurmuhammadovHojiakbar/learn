// Vector search demo with RediSearch (Lesson 11).
//
// Requires Redis STACK (not plain redis:7):
//   docker run --name redis-stack -p 6379:6379 -p 8001:8001 -d redis/redis-stack:latest
//   node vector-search.js
//
// To keep it runnable with no external API, we fake embeddings with a tiny deterministic
// "bag of keywords" vector. Real apps replace `embed()` with an embedding model's output.
import { SchemaFieldTypes, VectorAlgorithms } from 'redis';
import client from './redisClient.js';

const DIM = 8;
const KEYWORDS = ['cache', 'redis', 'node', 'queue', 'session', 'vector', 'search', 'lock'];

// Toy embedding: a normalized count of keyword occurrences. Purely illustrative.
function embed(text) {
  const v = KEYWORDS.map((k) => (text.toLowerCase().match(new RegExp(k, 'g')) || []).length);
  const norm = Math.hypot(...v) || 1;
  return v.map((x) => x / norm);
}

function toBytes(vec) {
  return Buffer.from(new Float32Array(vec).buffer);
}

const DOCS = [
  { id: 'doc:1', content: 'Cache-aside loads from the database on a miss and stores it in Redis cache.' },
  { id: 'doc:2', content: 'Use a Redis list or BullMQ to build a background job queue in Node.' },
  { id: 'doc:3', content: 'Store sessions in Redis so they are shared across Node app instances.' },
  { id: 'doc:4', content: 'A distributed lock uses SET NX to coordinate work across processes.' },
  { id: 'doc:5', content: 'Vector search finds the nearest embeddings for semantic search.' },
];

async function main() {
  // Clean slate (ignore if the index does not exist yet).
  try { await client.ft.dropIndex('idx:docs'); } catch {}
  for (const d of DOCS) await client.del(d.id);

  // 1. Create the index over doc:* hashes with a vector field.
  await client.ft.create('idx:docs', {
    content: { type: SchemaFieldTypes.TEXT },
    embedding: {
      type: SchemaFieldTypes.VECTOR,
      ALGORITHM: VectorAlgorithms.FLAT,   // exact KNN; fine for tiny demos
      TYPE: 'FLOAT32',
      DIM,
      DISTANCE_METRIC: 'COSINE',
    },
  }, { ON: 'HASH', PREFIX: 'doc:' });

  // 2. Insert docs with their embeddings.
  for (const d of DOCS) {
    await client.hSet(d.id, { content: d.content, embedding: toBytes(embed(d.content)) });
  }

  // 3. KNN query: find the 3 docs closest to the query.
  const query = 'how do I cache data in redis';
  const results = await client.ft.search(
    'idx:docs',
    '*=>[KNN 3 @embedding $vec AS score]',
    {
      PARAMS: { vec: toBytes(embed(query)) },
      SORTBY: 'score',
      DIALECT: 2,
      RETURN: ['score', 'content'],
    }
  );

  console.log(`\nQuery: "${query}"\nTop matches:`);
  for (const doc of results.documents) {
    console.log(`  [${Number(doc.value.score).toFixed(4)}] ${doc.value.content}`);
  }

  await client.quit();
}

main().catch((err) => {
  console.error('\n⚠️  This demo needs Redis Stack (FT.* + vector support).');
  console.error(err.message);
  process.exit(1);
});
