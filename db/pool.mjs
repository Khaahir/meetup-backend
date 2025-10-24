import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL

const pool = new Pool(connectionString ?{
    ssl: { rejectUnauthorized: false }
}:{
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,

})

module.exports={
    query: (text, params) => pool.query(text, params),
}