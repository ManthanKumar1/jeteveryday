let mongoose = require('mongoose')

let charterSchema = new mongoose.Schema({
    serviceProviderId: { type: String },
    planePic: { type: String },
    planeType: { type: String },
    model: { type: String },
    seats: { type: String },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Charter', charterSchema)