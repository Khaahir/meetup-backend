// db/pool.mjs
import pkg from 'pg';
const { Pool } = pkg;

const cs = process.env.DATABASE_URL;
console.log('[DB] using DATABASE_URL =', !!cs);

let pool;
if (cs) {
  try {
    const u = new URL(cs);
    console.log('[DB] url host =', u.hostname, 'db =', u.pathname.slice(1));
  } catch {
    console.log('[DB] DATABASE_URL present (redacted)');
  }
  pool = new Pool({
    connectionString: cs,
    // hosted PG needs SSL on Render
    ssl: cs.includes('localhost') ? false : { rejectUnauthorized: false },
  });
} else {
  console.log('[DB] falling back to discrete PG* vars');
  pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: { rejectUnauthorized: false },
  });
}

export default pool;
