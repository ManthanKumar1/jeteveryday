let mongoose = require('mongoose')

let stateSchema = new mongoose.Schema({
    countryId: { type: String },
    state: { type: String },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('State', stateSchema)