let mongoose = require('mongoose')

let countrySchema = new mongoose.Schema({
    country: { type: String },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Country', countrySchema)