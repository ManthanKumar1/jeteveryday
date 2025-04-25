let mongoose = require('mongoose')

let chatSchema = new mongoose.Schema({
    queryId: { type: String },
    serviceProviderId: { type: String },
    clientId: { type: String },
    text: { type: String },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Chat', chatSchema)