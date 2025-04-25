let mongoose = require('mongoose')

let serviceProviderSchema = new mongoose.Schema({
    providerType: { type: String, enum: ['Broker', 'Operator'] },
    providerName: { type: String },
    companyPic: { type: String },
    companyName: { type: String },
    companyNumber: { type: String },
    companyEmail: { type: String },
    companyAddress: { type: String },
    fcmProviderId: { type: String },
    isSubscribe: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Service Provider', serviceProviderSchema)