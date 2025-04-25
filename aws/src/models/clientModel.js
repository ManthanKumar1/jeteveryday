const mongoose = require('mongoose')

let clientSchema = new mongoose.Schema({
    profilePic: { type: String },
    clientName: { type: String },
    phoneNumber: { type: String, require: true, unique: true },
    email: { type: String },
    gender: { type: String, enum: ['M', 'F', 'O'] },
    leadPriority: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    companyName: { type: String },
    address: { type: String },
    fcmUserId: { type: String },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Client', clientSchema)