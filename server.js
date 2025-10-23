import dotenv from "dotenv"
import express from "express"
import meetupRoutes from "./src/routes"

dotenv.config()
app.use(express.json())

const app = express()
const port = process.env.PORT || 3000

app.get("/", (res,req)=>{
    res.status(200).send("meetup backend api is running")
})

app.listen(port,()=>{
    console.log(`servers is live on ${port}`)
} )