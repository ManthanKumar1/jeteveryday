let mongoose = require('mongoose')

let adminSchema = new mongoose.Schema({
    adminName: { type: String },
    adminPhone: { type: Number },
    adminEmail: { type: String },
    password: { type: String },
    token: { type: String },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Admin', adminSchema)