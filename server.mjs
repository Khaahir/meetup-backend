import dotenv from "dotenv";
import express from "express";
import pool from "./db/pool.mjs";
import router from "./src/routes.mjs";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'https://meetup-backend-my4m.onrender.com'
  ],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

app.use(express.json());

// simple logger to confirm requests reach this process
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// TEMP test route to prove POST /login works
app.post('/login', (_req, res) => {
  console.log('>>> HIT /login test route');
  res.json({ ping: 'ok-from-server' });
});

app.get('/', (_req, res) => {
  res.status(200).send('meetup backend api is running');
});

app.use('/', router);

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL anslutning OK.');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on ${port} (0.0.0.0)`);
    });
  } catch (error) {
    console.error('Kunde inte starta servern eller ansluta till DB:', error.message);
    process.exit(1);
  }
}

startServer(); 
