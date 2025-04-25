let mongoose = require('mongoose')

let aircraftSubClassSchema = new mongoose.Schema({
    aircraftClassId: { type: String, default: null },
    subClass: { type: String, default: null },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Aircraft Sub Class', aircraftSubClassSchema)