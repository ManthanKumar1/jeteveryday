let mongoose = require('mongoose')

let flightSchema = new mongoose.Schema({
    serviceProviderId: { type: String },
    planePic: { type: String },
    planeType: { type: String },
    planeDate: { type: String },
    boardingTime: { type: String },
    landingTime: { type: String },
    from: { type: String },
    to: { type: String },
    numberOfSeat: { type: String },
    numberOfBooking: { type: String },
    availableSeats: { type: String },
    charteredPrice: { type: String },
    perSeatPrice: { type: String },
    isCancel: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Flight Details', flightSchema)