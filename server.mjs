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