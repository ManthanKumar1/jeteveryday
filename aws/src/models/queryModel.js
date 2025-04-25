let mongoose = require('mongoose')

let querySchema = new mongoose.Schema({
    clientId: { type: String },
    charterId: { type: String },
    serviceProviderId: { type: String },
    from: { type: String },
    to: { type: String },
    flyDate: { type: String },
    boardingTime: { type: String },
    landingTime: { type: String },
    myPrice: { type: String },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Query', querySchema)