let clientModel = require('../models/clientModel')
let jwt = require('jsonwebtoken')
let { isValid, isValidObjectId, message, isValidPhone, isValidEmail } = require('../validator/validation')

let loginAndVerify = async function (req, res) {
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
            let updateClient = await clientModel.findOneAndUpdate({ phoneNumber: phoneNumber }, { $set: { fcmUserId: fcmUserId } }, { new: true })
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

let getClient = async function (req, res) {
    try {
        let { clientId, phoneNumber } = req.query

        if (clientId && !phoneNumber) {
            if (!isValid(clientId) || !isValidObjectId(clientId)) {
                return res.status(400).send({ status: false, message: message('Client Id') })
            }

            let fetchClient = await clientModel.findOne({ _id: clientId, isDeleted: false })
            if (!fetchClient) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            return res.status(200).send({ status: true, message: "Client details", data: fetchClient })
        } else if (!clientId && phoneNumber) {
            if (!isValid(phoneNumber) || !isValidPhone.test(phoneNumber)) {
                return res.status(400).send({ status: false, message: message('Phone Number') })
            }

            let fetchClient = await clientModel.findOne({ phoneNumber: phoneNumber, isDeleted: false })
            if (!fetchClient) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            return res.status(200).send({ status: true, message: "Client details", data: fetchClient })
        } else if (!clientId && !phoneNumber) {
            let fetchClient = await clientModel.find({ isDeleted: false })
            if (fetchClient.length == 0) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            return res.status(200).send({ status: true, message: "All Client details", count: fetchClient.length, data: fetchClient })
        } else {
            return res.status(400).send({ status: false, message: "Validation not match" })
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

        // if (checkClient._id != req.token.clientId) {
        //     return res.status(403).send({ status: false, message: "Unauthorized Client" })
        // }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { profilePic, clientName, phoneNumber, email, gender, dob, address, country, state, city, pincode } = data

        if (profilePic) {
            if (!isValid(profilePic)) {
                return res.status(400).send({ status: false, message: message('Client Profile Picture') })
            }
        } else {
            profilePic = checkClient.profilePic
        }

        if (clientName) {
            if (!isValid(clientName)) {
                return res.status(400).send({ status: false, message: message('Client Name') })
            }
        } else {
            clientName = checkClient.clientName
        }

        if (email) {
            if (!isValid(email) || !isValidEmail.test(email)) {
                return res.status(400).send({ status: false, message: message('Client Email') })
            }
        } else {
            email = checkClient.email
        }

        if (gender) {
            if (!isValid(gender) || !['M', 'F', 'O'].includes(gender)) {
                return res.status(400).send({ status: false, message: message('Gender') })
            }
        } else {
            gender = checkClient.gender
        }

        if (dob) {
            if (!isValid(dob)) {
                return res.status(400).send({ status: false, message: message('Date Of Birth') })
            }
        } else {
            dob = checkClient.dob
        }

        if (address) {
            if (!isValid(address)) {
                return res.status(400).send({ status: false, message: message('Address') })
            }
        } else {
            address = checkClient.address
        }

        if (country) {
            if (!isValid(country)) {
                return res.status(400).send({ status: false, message: message('Country') })
            }
        } else {
            country = checkClient.country
        }

        if (state) {
            if (!isValid(state)) {
                return res.status(400).send({ status: false, message: message('State') })
            }
        } else {
            state = checkClient.state
        }

        if (city) {
            if (!isValid(city)) {
                return res.status(400).send({ status: false, message: message('City') })
            }
        } else {
            city = checkClient.city
        }

        if (pincode) {
            if (!isValid(pincode)) {
                return res.status(400).send({ status: false, message: message('pincode') })
            }
        } else {
            pincode = checkClient.pincode
        }

        // if (companyId) {
        //     if (!isValid(companyId)) {
        //         return res.status(400).send({ status: false, message: message('Company Id') })
        //     }
        // } else {
        //     companyId = checkClient.companyId
        // }

        if (phoneNumber) {
            if (checkClient.phoneNumber != phoneNumber) {
                if (!isValid(phoneNumber) || !isValidPhone.test(phoneNumber)) {
                    return res.status(400).send({ status: false, message: message('Phone Number') })
                }

                let updateStatus = await clientModel.findOneAndUpdate({ _id: clientId }, { $set: { isActive: false } }, { new: true })
            }
        } else {
            phoneNumber = checkClient.phoneNumber
        }

        let updateData = { profilePic, clientName, phoneNumber, email, gender, dob, address, country, state, city, pincode }

        let updateClient = await clientModel.findOneAndUpdate({ _id: clientId }, { $set: updateData }, { new: true })

        return res.status(200).send({ status: true, message: "Client updated successfully", data: updateClient })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let clientStatus = async function (req, res) {
    try {
        let clientId = req.params.clientId
        if (!isValid(clientId) || !isValidObjectId(clientId)) {
            return res.status(400).send({ status: false, message: message('Client Id') })
        }

        let checkClient = await clientModel.findOne({ _id: clientId, isDeleted: false })
        if (!checkClient) {
            return res.status(404).send({ status: false, message: "Client not found" })
        }

        if (checkClient._id != req.token.clientId) {
            return res.status(403).send({ status: false, message: "Unauthorized Client" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { isActive } = data

        if (typeof isActive !== 'boolean') {
            return res.status(400).send({ status: false, message: 'Is Active Status must be a boolean' })
        }

        if (isActive === checkClient.isActive) {
            return res.status(400).send({ status: false, message: `Your status is already ${isActive ? 'active' : 'inactive'}` })
        }

        let updateStatus = await clientModel.findOneAndUpdate({ _id: clientId }, { $set: { isActive: isActive } }, { new: true })

        return res.status(200).send({ status: true, message: "Status updated successfully", data: updateStatus })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteClient = async function (req, res) {
    try {
        let clientId = req.params.clientId
        if (!isValid(clientId) || !isValidObjectId(clientId)) {
            return res.status(400).send({ status: false, message: message('Client Id') })
        }

        // if (clientId != req.token.clientId) {
        //     return res.status(403).send({ status: false, message: "Unauthorized Client" })
        // }

        let deleteClient = await clientModel.findOneAndUpdate({ _id: clientId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        if (!deleteClient) {
            return res.status(404).send({ status: false, message: "Client not found" })
        }

        return res.status(200).send({ status: true, message: "Client deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { loginAndVerify, getClient, updateClient, clientStatus, deleteClient }