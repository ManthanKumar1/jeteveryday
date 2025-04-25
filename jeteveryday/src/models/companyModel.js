let mongoose = require('mongoose')

let companySchema = new mongoose.Schema({
    companyType: { type: String, enum: ['Proprietorship', 'Private Limited', 'LLC', 'Limited'], default: null },
    businessType: [{ type: String, enum: ['Broker', 'Operator', 'Travel Agent'], default: null }],
    companyLogo: { type: String, default: null },
    companyName: { type: String, default: null },
    companyNumber: { type: String, default: null },
    companyEmail: { type: String, default: null },
    password: { type: String, default: null },
    companyAddress: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: Number, default: null },
    companyGst: { type: String, default: null },
    gstDocument: { type: String, default: null },
    companyPan: { type: String, default: null },
    panDocument: { type: String, default: null },
    companyCin: { type: String, default: null },
    cinDocument: { type: String, default: null },
    travelAgentLevel: { type: String, default: null },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Company', companySchema)