let mongoose = require('mongoose')

let citySchema = new mongoose.Schema({
    countryId: { type: String },
    stateId: { type: String },
    city: { type: String },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('City', citySchema)