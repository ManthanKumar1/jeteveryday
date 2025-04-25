let mongoose = require('mongoose')

let bookingSchema = new mongoose.Schema({
    flightId: { type: String },
    serviceProviderId: { type: String },
    clientId: { type: String },
    numberOfPassangers: { type: String },
    isConfirm: { type: Boolean, default: false },
    isCancel: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)