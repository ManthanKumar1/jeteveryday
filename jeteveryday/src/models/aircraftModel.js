let mongoose = require('mongoose')

let aircraftSchema = new mongoose.Schema({
    companyId: { type: String, default: null },
    aircraftClassId: { type: String, default: null },
    aircraftSubClassId: { type: String, default: null },
    aircraftTypeId: { type: String, default: null },
    registrationNumber: { type: String, default: null },
    passengerCapacity: { type: Number, default: null },
    baggageCapacity: { type: String, default: null },
    numberOfPilots: { type: Number, default: null },
    meal: { type: String, enum: ['Yes', 'No', 'May Be'], default: 'No' },
    lav: { type: String, enum: ['Yes', 'No'], default: 'No' },
    cabinCrew: { type: String, enum: ['Yes', 'No', 'May Be'], default: 'No' },
    interiorPic: { type: [String], default: null },
    exteriorPic: { type: [String], default: null },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Aircraft', aircraftSchema)