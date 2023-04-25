const mongoose = require("mongoose")
const Schema = mongoose.Schema
const {FlightModel} = require("./flightModel")
const {UserModel} = require("./userModel")
const bookingSchema = mongoose.Schema({
  user : {type: Schema.Types.ObjectId, ref: UserModel },
  flight : {type: Schema.Types.ObjectId, ref: FlightModel}
}
)

  const BookingModel = mongoose.model("booking",bookingSchema)

  module.exports = {BookingModel}



