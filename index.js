const express = require("express")
const app = express()
app.use(express.json())
const cors =require("cors")
app.use(cors())
const {userRouter} = require("./routes/userRoutes")
const{ connection} = require("./config/db")
require("dotenv").config()

app.get("/",(req,res)=>{
    res.send("Welcome")
})
app.use("/",userRouter)
app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }
    console.log(`port is running at ${process.env.port}`)
})