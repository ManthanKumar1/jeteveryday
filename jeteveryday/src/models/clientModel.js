let mongoose = require('mongoose')

let clientSchema = new mongoose.Schema({
    profilePic: { type: String, default: null },
    clientName: { type: String, default: null },
    phoneNumber: { type: String, require: true },
    email: { type: String, default: null },
    gender: { type: String, enum: ['M', 'F', 'O'], default: null },
    dob: { type: Date, default: null },
    address: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: Number, default: null },
    companyId: { type: String, default: null },
    fcmUserId: { type: String, default: null },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Client', clientSchema)