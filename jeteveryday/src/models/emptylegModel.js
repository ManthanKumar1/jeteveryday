let mongoose = require('mongoose')

let emptyLegSchema = new mongoose.Schema({
    aircraftId: { type: String, default: null },
    date: { type: Date, default: null },
    departureLocation: { type: String, default: null },
    departureAirport: {type: String, default: null},
    departureTime: { type: String, default: null },
    arrivalLocation: { type: String, default: null },
    arrivalAirport: {type: String, default: null},
    arrivalTime: { type: String, default: null },
    pricePerSeat: { type: Number, default: null },
    charteredPrice: { type: String, default: null },
    numberOfSeat: { type: Number, default: null },
    availableSeat: { type: Number, default: null },
    bookedSeat: { type: Number, default: null },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Empty Leg', emptyLegSchema)