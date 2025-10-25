// server.mjs (very top)
const _stringify = JSON.stringify;

function stringifyTripwire(value, ...rest) {
  // Detect circulars with a WeakSet walk
  const seen = new WeakSet();
  let circular = false;
  function scan(v) {
    if (v && typeof v === 'object') {
      if (seen.has(v)) { circular = true; return; }
      seen.add(v);
      // scan shallow to keep it cheap
      for (const k of Object.keys(v)) {
        const child = v[k];
        if (child && typeof child === 'object') scan(child);
        if (circular) return;
      }
    }
  }
  try { scan(value); } catch { /* ignore */ }

  if (circular) {
    const err = new Error('Tripwire: JSON.stringify on circular value');
    // Print a *useful* preview without crashing
    console.warn('[Tripwire] JSON.stringify on circular value. Keys:', 
      value && typeof value === 'object' ? Object.keys(value) : typeof value
    );
    console.warn(err.stack);
  }
  return _stringify.call(this, value, ...rest);
}
JSON.stringify = stringifyTripwire;


import dotenv from "dotenv"
import express from "express"
import pool from "./db/pool.mjs"
import router from "./src/routes.mjs"



const app = express()
dotenv.config()
app.use(express.json())
const port = process.env.PORT || 3000

app.get("/", (req,res)=>{
    res.status(200).send("meetup backend api is running")
})

app.use('/', router);

app.listen(port,()=>{
    console.log(`servers is live on ${port}`)
    
    
    async function startServer() {
        try {
            // Testa databasanslutningen innan servern startar
            await pool.query('SELECT 1');
            console.log('PostgreSQL anslutning OK.');
            
            // Starta express-servern
            app.listen(port, () => {
                console.log(`Servern lyssnar på port ${port}`);
            });
            
        } catch (error) {
            console.error('Kunde inte starta servern eller ansluta till DB:', error.message);
            // Avsluta om vi inte kan nå databasen
            process.exit(1); 
        }
    }

    startServer()
} )