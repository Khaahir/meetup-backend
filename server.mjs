import dotenv from "dotenv";
import express from "express";
import pool from "./db/pool.mjs";
import router from "./src/routes.mjs";
import cors from "cors";

dotenv.config();
console.log("vi testart lite här!!!!!!")
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173/", // for local testing
      "http://meetups-frontend-gruppexamination.s3-website.eu-north-1.amazonaws.com/",
      "https://meetups-frontend-gruppexamination.s3-website.eu-north-1.amazonaws.com/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());



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
