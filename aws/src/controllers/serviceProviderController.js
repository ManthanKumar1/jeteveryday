let serviceProviderModel = require('../models/serviceProviderModel')
let jwt = require('jsonwebtoken')
let { isValid, isValidObjectId, message, isValidPhone, isValidEmail } = require('../validator/validation')

let registerAndLoginProvider = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { companyNumber, fcmProviderId } = data

        if (!isValid(companyNumber) || !isValidPhone.test(companyNumber)) {
            return res.status(400).send({ status: false, message: message('Company Number') })
        }

        if (!isValid(fcmProviderId)) {
            return res.status(400).send({ status: false, message: message('FCM Provider Id') })
        }

        let checkProvider = await serviceProviderModel.findOne({ companyNumber: companyNumber, isDeleted: false })
        if (!checkProvider) {
            let createProvider = await serviceProviderModel.create(data)

            let fetchProvider = await serviceProviderModel.findOne({ companyNumber: companyNumber, isDeleted: false })
            // if (!fetchProvider) {
            //     return res.status(404).send({ status: false, message: "provider not found" })
            // }

            let token = jwt.sign({
                providerId: fetchProvider._id.toString()
            }, "Provider")

            let showData = {
                providerId: fetchProvider._id,
                token: token
            }

            return res.status(201).send({ status: true, message: "Provider created successfully", data: showData })
        } else {
            let token = jwt.sign({
                providerId: checkProvider._id.toString()
            }, "Provider")

            let showData = {
                providerId: checkProvider._id,
                token: token
            }

            return res.status(200).send({ status: true, message: "Provider login successfully", data: showData })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getProvider = async function (req, res) {
    try {
        let providerId = req.query.providerId
        let companyNumber = req.query.companyNumber

        if (providerId && !companyNumber) {
            let fetchProvider = await serviceProviderModel.findOne({ _id: providerId, isDeleted: false })
            if (!fetchProvider) {
                return res.status(404).send({ status: false, message: "Provider not found" })
            }

            return res.status(200).send({ status: true, message: "Your provider", data: fetchProvider })
        } else if (!providerId && companyNumber) {
            let fetchProvider = await serviceProviderModel.findOne({ companyNumber: companyNumber, isDeleted: false })
            if (!fetchProvider) {
                return res.status(404).send({ status: false, message: "Provider not found" })
            }

            return res.status(200).send({ status: true, message: "Your provider", data: fetchProvider })
        } else {
            let fetchProvider = await serviceProviderModel.findOne({ isDeleted: false })
            if (!fetchProvider) {
                return res.status(404).send({ status: false, message: "Provider not found" })
            }

            return res.status(200).send({ status: true, message: "All provider", count: fetchProvider.length, data: fetchProvider })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let registrationForm = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { providerType, providerName, companyPic, companyName, companyNumber, companyEmail, companyAddress } = data

        let registrationForm = await serviceProviderModel.create(data)

        return res.status(201).send({ status: true, message: "provider created successfully", data: registrationForm })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { registerAndLoginProvider, getProvider, registrationForm }