// | METHOD | ENDPOINT | DESCRIPTION | STATUS CODE |
// | --- | --- | --- | --- |
// | POST | /api/register | This endpoint should allow users to register. | 201 |
// | POST | /api/login | This endpoint should allow users to login. | 201 |
// | GET | /api/flights | This endpoint should return a list of all available flights. | 200 |
// | GET | /api/flights/:id | This endpoint should return the details of a specific flight identified by its ID. | 200 |
// | POST | /api/flights | This endpoint should allow users to add new flights to the system. | 201 |
// | PUT / PATCH | /api/flights/:id | This endpoint should allow users to update the details of a specific flight identified by its ID. | 204 |use
// | DELETE | /api/flights/:id | This endpoint should allow users to delete a specific flight identified by its ID. | 202 |
// | POST | /api/booking | This endpoint should allow the user to book flights. | 201 |
// | GET | /api/dashboard | This point should list all the bookings so far with the user and flight details. | 200 |

const express = require("express")
const app = express()
const {UserModel} = require("../models/userModel")
const {FlightModel} = require("../models/flightModel")
const {BookingModel} = require("../models/bookingModel")
app.use(express.json())
const userRouter = express.Router()

userRouter.get("/flights/:id",async(req,res)=>{
    let params = req.params
    try {
        let allFlights = await FlightModel.findById({_id:params.id})
        res.status(200).send(allFlights)
    } catch (error) {
        res.status(400).send({message:"something went wrong",error:error.message})
        
    }
})

userRouter.get("/flights",async(req,res)=>{
    try {
        let allFlights = await FlightModel.find()
        res.status(200).send(allFlights)
    } catch (error) {
        res.status(400).send({message:"something went wrong",error:error.message})
        
    }
})

userRouter.get("/dashboard",async(req,res)=>{
    try {
        let allBookings = await BookingModel.aggregate([
            {$lookup: {
              from:"users",
              localField: "user",
              foreignField: "_id",
              as: "UserDetails"
             }},
             {$lookup: {
                from:"flights",
                localField: "flight",
                foreignField: "_id",
                as: "FlightDetails"
               }},
             
          ])
        res.status(200).send(allBookings)
    } catch (error) {
        res.status(400).send({message:"something went wrong",error:error.message})
        
    }
})


userRouter.post("/register",async(req,res)=>{
    try {
        let newUser = new UserModel(req.body)
        newUser.save()
        res.status(201).send({message:"User registered succesfully",newUser})
    } catch (error) {
        res.status(400).send({message:"something went wrong",error:error.message})
        
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        let newUser =await UserModel.find({email})
        if(newUser.length>0){
            if(newUser[0].password == password){
                res.status(201).send({message:"User loggedin succesfully",newUser})
            }else{
                res.status(400).send({message:"wrong password"})
            }
        }else{
            res.status(404).send({message:"user not found"})

        }
    } catch (error) {
        res.status(400).send({message:"something went wrong",error:error.message})
        
    }
})

userRouter.post("/flights",async(req,res)=>{
    try {
        let newflight = new FlightModel(req.body)
        newflight.save()
        res.status(201).send({message:"new flight added succesfully",newflight})
    } catch (error) {
        res.status(400).send({message:"something went wrong",error:error.message})
        
    }
})

userRouter.post("/booking",async(req,res)=>{
    try {
        let newBooking = new BookingModel(req.body)
        newBooking.save()
        res.status(201).send({message:"Booking succesfully",newBooking})
    } catch (error) {
        res.status(400).send({message:"something went wrong",error:error.message})
        
    }
})

userRouter.patch("/flights/:id",async(req,res)=>{
    let params = req.params
    try {
        await FlightModel.findByIdAndUpdate({_id:params.id},req.body)
        res.status(204).send({message:"Data updated Succesfully"})
    } catch (error) {
        res.status(400).send({message:"something went wrong",error:error.message})
        
    }
})


userRouter.delete("/flights/:id",async(req,res)=>{
    let params = req.params
    try {
        await FlightModel.findByIdAndDelete({_id:params.id})
        res.status(202).send({message:"Data deleted Succesfully"})
    } catch (error) {
        res.status(400).send({message:"something went wrong",error:error.message})
        
    }
})

module.exports={
    userRouter
}