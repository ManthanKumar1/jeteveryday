let mongoose = require('mongoose')

let aircraftClassSchema = new mongoose.Schema({
    aircraftClass: { type: String, default: null },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Aircraft Class', aircraftClassSchema)