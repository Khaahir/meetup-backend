import pkg from 'pg';
const { Pool } = pkg;

const cs = process.env.DATABASE_URL;
export default new Pool({
  connectionString: cs,
  ssl: cs?.includes('localhost') ? false : { rejectUnauthorized: false },
});