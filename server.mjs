import dotenv from "dotenv"
import express from "express"



const app = express()
dotenv.config()
app.use(express.json())
const port = process.env.PORT || 3000

app.get("/", (req,res)=>{
    res.status(200).send("meetup backend api is running")
})

app.listen(port,()=>{
    console.log(`servers is live on ${port}`)
} )