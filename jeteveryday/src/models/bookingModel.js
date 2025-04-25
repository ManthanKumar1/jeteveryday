let mongoose = require('mongoose')

let bookingSchema = new mongoose.Schema({
    emptyLegId: { type: String, default: null },
    companyId: { type: String, default: null },
    clientId: { type: String, default: null },
    numberOfPassangers: { type: String, default: null },
    isCancel: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)