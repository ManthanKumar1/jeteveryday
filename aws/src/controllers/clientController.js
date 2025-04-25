const clientModel = require('../models/clientModel')
let jwt = require('jsonwebtoken')
const { isValid, isValidObjectId, message, isValidPhone, isValidEmail, isValidPriority } = require('../validator/validation')

let registerAndLogin = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { phoneNumber, fcmUserId } = data

        if (!isValid(phoneNumber) || !isValidPhone.test(phoneNumber)) {
            return res.status(400).send({ status: false, message: message('Phone Number') })
        }

        if (!isValid(fcmUserId)) {
            return res.status(400).send({ status: false, message: message('FCM User Id') })
        }

        let checkPhone = await clientModel.findOne({ phoneNumber: phoneNumber, isDeleted: false })
        if (!checkPhone) {
            let createClient = await clientModel.create(data)

            let fetchClient = await clientModel.findOne({ phoneNumber: phoneNumber, isDeleted: false })

            let token = jwt.sign({
                clientId: fetchClient._id.toString()
            }, "client")

            let showData = {
                clientId: fetchClient._id,
                phoneNumber: fetchClient.phoneNumber,
                token: token
            }

            return res.status(201).send({ status: true, message: "Client created successfully", data: showData })
        } else {
            let token = jwt.sign({
                clientId: checkPhone._id.toString()
            }, "client")

            let showData = {
                clientId: checkPhone._id,
                phoneNumber: checkPhone.phoneNumber,
                token: token
            }

            return res.status(200).send({ status: true, message: "Client login successfully", data: showData })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateClient = async function (req, res) {
    try {
        let clientId = req.params.clientId
        if (!isValid(clientId) || !isValidObjectId(clientId)) {
            return res.status(400).send({ status: false, message: message('Client Id') })
        }

        let checkClient = await clientModel.findOne({ _id: clientId, isDeleted: false })
        if (!checkClient) {
            return res.status(404).send({ status: false, message: "Client not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { profilePic, clientName, phoneNumber, email, gender, leadPriority, companyName, address } = data

        if (profilePic) {
            if (!isValid(profilePic)) {
                return res.status(400).send({ status: false, message: message('Profile Picture') })
            }
        }

        if (clientName) {
            if (!isValid(clientName)) {
                return res.status(400).send({ status: false, message: message('Client Name') })
            }
        } else {
            clientName = checkClient.clientName
        }

        if (phoneNumber) {
            if (!isValid(phoneNumber) || !isValidPhone.test(phoneNumber)) {
                return res.status(400).send({ status: false, message: message('Phone Number') })
            }
        } else {
            phoneNumber = checkClient.phoneNumber
        }

        if (email) {
            if (!isValid(email) || !isValidEmail.test(email)) {
                return res.status(400).send({ status: false, message: message('Client Name') })
            }
        } else {
            email = checkClient.email
        }

        if (gender) {
            if (!isValid(gender) || gender != 'M' && gender != 'F' && gender != 'O') {
                return res.status(400).send({ status: false, message: message('Gender') })
            }
        } else {
            gender = checkClient.gender
        }

        if (leadPriority) {
            if (!isValid(leadPriority) || !isValidPriority.test(leadPriority)) {
                return res.status(400).send({ status: false, message: message('Lead Priority') })
            }
        } else {
            leadPriority = checkClient.leadPriority
        }

        if (companyName) {
            if (!isValid(companyName)) {
                return res.status(400).send({ status: false, message: message('Company Name') })
            }
        } else {
            companyName = checkClient.companyName
        }

        if (address) {
            if (!isValid(address)) {
                return res.status(400).send({ status: false, message: message('Address') })
            }
        } else {
            address = checkClient.address
        }

        let updateClient = await clientModel.findOneAndUpdate({ _id: clientId }, { $set: data }, { new: true })

        return res.status(200).send({ status: true, message: "Client updated successfully", data: updateClient })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { registerAndLogin, updateClient }