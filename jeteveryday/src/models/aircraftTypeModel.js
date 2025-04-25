let mongoose = require('mongoose')

let aircraftTypeSchema = new mongoose.Schema({
    aircraftClassId: { type: String, default: null },
    aircraftSubClassId: { type: String, default: null },
    aircraftType: { type: String, default: null },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Aircraft Type', aircraftTypeSchema)