let companyModel = require('../models/companyModel')
let clientModel = require('../models/clientModel')
let jwt = require('jsonwebtoken')
let argon2 = require('argon2')
let { isValid, isValidObjectId, message, isValidPhone, isValidEmail, isValidPassword, isValidPincode, isValidGst, isValidPan, isValidCin } = require('../validator/validation')

let createCompany = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { clientId, companyType, businessType, companyLogo, companyName, companyNumber, companyEmail, password, companyAddress, country, state, city, pincode, companyGst, gstDocument, companyPan, panDocument, companyCin, cinDocument, travelAgentLevel } = data

        if (!isValid(clientId) && !isValidObjectId(clientId)) {
            return res.status(400).send({ status: false, message: message('Client Id') })
        }

        let checkClient = await clientModel.findOne({ _id: clientId, isDeleted: false })
        if (!checkClient) {
            return res.status(404).send({ status: false, message: "Client not found" })
        }


        if (!isValid(companyType) || !['Proprietorship', 'Private Limited', 'LLC', 'Limited'].includes(companyType)) {
            return res.status(400).send({ status: false, message: message('Company Type') })
        }

        if (!isValid(businessType) || !['Broker', 'Operator', 'Travel Agent'].includes(businessType)) {
            return res.status(400).send({ status: false, message: message('Business Type') })
        }

        if (companyLogo) {
            if (!isValid(companyLogo)) {
                return res.status(400).send({ status: false, message: message('Company Logo') })
            }
        }

        if (!isValid(companyName)) {
            return res.status(400).send({ status: false, message: message('Company Name') })
        }

        let checkCompany = await companyModel.findOne({ companyName: companyName, isDeleted: false })
        if (checkCompany) {
            return res.status(400).send({ status: false, message: "Company Name already in use" })
        }

        if (!isValid(companyNumber) && !isValidPhone.test(companyNumber)) {
            return res.status(400).send({ status: false, message: message('Company Number') })
        }

        if (!isValid(companyEmail) && !isValidEmail.test(companyEmail)) {
            return res.status(400).send({ status: false, message: message('Company Email') })
        }

        if (!isValid(password) && !isValidPassword.test(password)) {
            return res.status(400).send({ status: false, message: message('Password') })
        }
        data.password = await argon2.hash(password)

        if (!isValid(companyAddress)) {
            return res.status(400).send({ status: false, message: message('Company Address') })
        }

        if (!isValid(country)) {
            return res.status(400).send({ status: false, message: message('Country') })
        }

        if (!isValid(state)) {
            return res.status(400).send({ status: false, message: message('State') })
        }

        if (!isValid(city)) {
            return res.status(400).send({ status: false, message: message('City') })
        }

        if (!isValid(pincode) && !isValidPincode.test(pincode)) {
            return res.status(400).send({ status: false, message: message('Pincode') })
        }

        if (!isValid(companyGst) && !isValidGst.test(companyGst)) {
            return res.status(400).send({ status: false, message: message('Company GST') })
        }

        if (!isValid(gstDocument)) {
            return res.status(400).send({ status: false, message: message('GST Document') })
        }

        if (!isValid(companyPan) && !isValidPan.test(companyPan)) {
            return res.status(400).send({ status: false, message: message('Company PAN') })
        }

        if (!isValid(panDocument)) {
            return res.status(400).send({ status: false, message: message('PAN Document') })
        }

        if (businessType === 'Proprietorship') {
            if (!isValid(companyCin) && !isValidCin.test(companyCin)) {
                return res.status(400).send({ status: false, message: message('Company CIN') })
            }

            if (!isValid(cinDocument)) {
                return res.status(400).send({ status: false, message: message('CIN Document') })
            }
        } else {
            if (companyCin) {
                if (!isValid(companyCin) && !isValidCin.test(companyCin)) {
                    return res.status(400).send({ status: false, message: message('Company CIN') })
                }

                if (!isValid(cinDocument)) {
                    return res.status(400).send({ status: false, message: message('CIN Document') })
                }
            }
        }

        let createCompany = await companyModel.create(data)

        let fetchCompany = await companyModel.findOne({ companyName: companyName, isDeleted: false })

        let companyId = fetchCompany._id

        let updateClient = await clientModel.findOneAndUpdate({ _id: clientId }, { $set: { companyId: companyId } }, { new: true })

        return res.status(201).send({ status: true, message: "Company created successfully", data: createCompany })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let loginCompany = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { companyEmail, password } = data

        if (!isValid(companyEmail) && !isValidEmail.test(companyEmail)) {
            return res.status(400).send({ status: false, message: message('Company Email') })
        }

        let checkCompany = await companyModel.findOne({ companyEmail: companyEmail, isDeleted: false })
        if (!checkCompany) {
            return res.status(404).send({ status: false, message: "Company not found" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: message('Password') })
        }

        let checkPassword = await argon2.verify(checkCompany.password, password)
        if (!checkPassword) {
            return res.status(400).send({ status: false, message: "Incorrect Password" })
        }

        let token = jwt.sign({
            companyId: checkCompany._id.toString()
        }, "company")

        let showData = {
            companyId: checkCompany._id,
            token: token
        }

        return res.status(200).send({ status: true, message: 'Company login successfully', data: showData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let addUser = async function (req, res) {
    try {
        let companyId = req.params.companyId
        if (!isValid(companyId) && !isValidObjectId(companyId)) {
            return res.status(400).send({ status: false, message: message('Company Id') })
        }

        let checkCompany = await companyModel.findOne({ _id: companyId, isDeleted: false })
        if (!checkCompany) {
            return res.status(404).send({ status: false, message: "Company not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { clientId, phoneNumber } = data

        if (clientId && !phoneNumber) {
            if (!isValid(clientId) && !isValidObjectId(clientId)) {
                return res.status(400).send({ status: false, message: message('Client Id') })
            }

            let updateClient = await clientModel.findOneAndUpdate({ _id: clientId, isDeleted: false }, { $set: { companyId: companyId } }, { new: true })
            if (!updateClient) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            return res.status(200).send({ status: true, message: "Client add to the company", clientDetail: updateClient })
        } else if (!clientId && phoneNumber) {
            if (!isValid(phoneNumber) && !isValidPhone.test(phoneNumber)) {
                return res.status(400).send({ status: false, message: message('Client Phone Number') })
            }

            let updateClient = await clientModel.findOneAndUpdate({ phoneNumber: phoneNumber, isDeleted: false }, { $set: { companyId: companyId } }, { new: true })
            if (!updateClient) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            return res.status(200).send({ status: true, message: "Client add to the company", clientDetail: updateClient })
        } else {
            return res.status(400).send({ status: false, message: "Validation not match" })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let removeUser = async function (req, res) {
    try {
        let companyId = req.params.companyId
        if (!isValid(companyId) && !isValidObjectId(companyId)) {
            return res.status(400).send({ status: false, message: message('Company Id') })
        }

        let checkCompany = await companyModel.findOne({ _id: companyId, isDeleted: false })
        if (!checkCompany) {
            return res.status(404).send({ status: false, message: "Company not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { clientId, phoneNumber } = data

        if (clientId && !phoneNumber) {
            if (!isValid(clientId) && !isValidObjectId(clientId)) {
                return res.status(400).send({ status: false, message: message('Client Id') })
            }

            let updateClient = await clientModel.findOneAndUpdate({ _id: clientId, isDeleted: false }, { $set: { companyId: null } }, { new: true })
            if (!updateClient) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            return res.status(200).send({ status: true, message: "Client removed from the company", clientDetail: updateClient })
        } else if (!clientId && phoneNumber) {
            if (!isValid(phoneNumber) && !isValidPhone.test(phoneNumber)) {
                return res.status(400).send({ status: false, message: message('Client Phone Number') })
            }

            let updateClient = await clientModel.findOneAndUpdate({ phoneNumber: phoneNumber, isDeleted: false }, { $set: { companyId: null } }, { new: true })
            if (!updateClient) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            return res.status(200).send({ status: true, message: "Client removed from the company", clientDetail: updateClient })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getCompany = async function (req, res) {
    try {
        let companyId = req.query.companyId

        if (companyId) {
            if (!isValid(companyId) && !isValidObjectId(companyId)) {
                return res.status(400).send({ status: false, message: message('Company Id') })
            }

            let fetchCompany = await companyModel.findOne({ _id: companyId, isDeleted: false })
            if (!fetchCompany) {
                return res.status(404).send({ status: false, message: "Company not found" })
            }

            let fetchClient = await clientModel.find({ companyId: companyId, isDeleted: false })
            if (fetchClient.length == 0) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            return res.status(200).send({ status: true, message: "Your company details", clientCount: fetchClient.length, companyData: fetchCompany, clientData: fetchClient })
        } else {
            let fetchCompany = await companyModel.find({ isDeleted: false })
            if (fetchCompany.length == 0) {
                return res.status(404).send({ status: false, message: "Company not found" })
            }

            let companyArr = []

            for (let i = 0; i < fetchCompany.length; i++) {
                let fetchClient = await clientModel.find({ companyId: fetchCompany[i]._id, isDeleted: false })
                companyArr.push({ company: fetchCompany[i], client: fetchClient })
            }

            return res.status(200).send({ status: true, message: "All Companies", count: fetchCompany.length, data: companyArr })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateCompany = async function (req, res) {
    try {
        let companyId = req.params.companyId
        if (!isValid(companyId) && !isValidObjectId(companyId)) {
            return res.status(400).send({ status: false, message: message('Company Id') })
        }

        let checkCompany = await companyModel.findOne({ _id: companyId, isDeleted: false })
        if (!checkCompany) {
            return res.status(404).send({ status: false, message: "Company not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { companyType, businessType, companyLogo, companyName, companyNumber, companyEmail, password, companyAddress, country, state, city, pincode, companyGst, gstDocument, companyPan, panDocument, companyCin, cinDocument, travelAgentLevel } = data

        if (companyType) {
            if (!isValid(companyType) || !['Proprietorship', 'Private Limited', 'LLC', 'Limited'].includes(companyType)) {
                return res.status(400).send({ status: false, message: message('Company Type') })
            }
        } else {
            companyType = checkCompany.companyType
        }

        if (businessType) {
            if (typeof businessType !== 'string') {
                return res.status(400).send({ status: false, message: 'Business Type must be a string' })
            }

            let validTypes = ['Broker', 'Operator', 'Travel Agent']
            if (!validTypes.includes(businessType)) {
                return res.status(400).send({ status: false, message: `Business Company Type: ${businessType}` })
            }

            if (!checkCompany.businessType.includes(businessType)) {
                checkCompany.businessType.push(businessType)
            } else {
                return res.status(400).send({ status: false, message: `Business Type '${businessType}' already exists` })
            }
        }

        if (companyLogo) {
            if (!isValid(companyLogo)) {
                return res.status(400).send({ status: false, message: message('Company Logo') })
            }
        } else {
            companyLogo = checkCompany.companyLogo
        }

        if (companyName) {
            if (!isValid(companyName)) {
                return res.status(400).send({ status: false, message: message('Company Name') })
            }
        } else {
            companyName = checkCompany.companyName
        }

        if (companyNumber) {
            if (!isValid(companyNumber) && !isValidPhone.test(companyNumber)) {
                return res.status(400).send({ status: false, message: message('Company Number') })
            }
        } else {
            companyNumber = checkCompany.companyNumber
        }

        if (companyEmail) {
            if (!isValid(companyEmail) && !isValidEmail.test(companyEmail)) {
                return res.status(400).send({ status: false, message: message('Company Email') })
            }
        } else {
            companyEmail = checkCompany.companyEmail
        }

        if (password) {
            if (!isValid(password) && !isValidPassword.test(password)) {
                return res.status(400).send({ status: false, message: message('Password') })
            }
            password = await argon2.hash(password)
        } else {
            password = checkCompany.password
        }

        if (companyAddress) {
            if (!isValid(companyAddress)) {
                return res.status(400).send({ status: false, message: message('Company Address') })
            }
        } else {
            companyAddress = checkCompany.companyAddress
        }

        if (country) {
            if (!isValid(country)) {
                return res.status(400).send({ status: false, message: message('Country') })
            }
        } else {
            country = checkCompany.country
        }

        if (state) {
            if (!isValid(state)) {
                return res.status(400).send({ status: false, message: message('State') })
            }
        } else {
            state = checkCompany.state
        }

        if (city) {
            if (!isValid(city)) {
                return res.status(400).send({ status: false, message: message('City') })
            }
        } else {
            city = checkCompany.city
        }

        if (pincode) {
            if (!isValid(pincode) && !isValidPincode.test(pincode)) {
                return res.status(400).send({ status: false, message: message('Pincode') })
            }
        } else {
            pincode = checkCompany.pincode
        }

        if (companyGst) {
            if (!isValid(companyGst) && !isValidGst.test(companyGst)) {
                return res.status(400).send({ status: false, message: message('Company GST') })
            }
        } else {
            companyGst = checkCompany.companyGst
        }

        if (gstDocument) {
            if (!isValid(gstDocument)) {
                return res.status(400).send({ status: false, message: message('GST Document') })
            }
        } else {
            gstDocument = checkCompany.gstDocument
        }

        if (companyPan) {
            if (!isValid(companyPan) && !isValidPan.test(companyPan)) {
                return res.status(400).send({ status: false, message: message('Company PAN') })
            }
        } else {
            companyPan = checkCompany.companyPan
        }

        if (panDocument) {
            if (!isValid(panDocument)) {
                return res.status(400).send({ status: false, message: message('PAN Document') })
            }
        } else {
            panDocument = checkCompany.panDocument
        }

        if (companyCin) {
            if (!isValid(companyCin) && !isValidCin.test(companyCin)) {
                return res.status(400).send({ status: false, message: message('Company CIN') })
            }
        } else {
            companyCin = checkCompany.companyCin
        }

        if (cinDocument) {
            if (!isValid(cinDocument)) {
                return res.status(400).send({ status: false, message: message('CIN Document') })
            }
        } else {
            cinDocument = checkCompany.cinDocument
        }

        let updatedData = { companyType, businessType: checkCompany.businessType, companyLogo, companyName, companyNumber, companyEmail, password, companyAddress, country, state, city, pincode, companyGst, gstDocument, companyPan, panDocument, companyCin, cinDocument }

        let updateCompany = await companyModel.findOneAndUpdate({ _id: companyId }, { $set: updatedData }, { new: true })

        return res.status(200).send({ status: true, message: "Company updated successfully", data: updateCompany })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteCompany = async function (req, res) {
    try {
        let companyId = req.params.companyId
        if (!isValid(companyId) && !isValidObjectId(companyId)) {
            return res.status(400).send({ status: false, message: message('Company Id') })
        }

        let deleteCompany = await companyModel.findOneAndUpdate({ _id: companyId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
        if (!deleteCompany) {
            return res.status(404).send({ status: false, message: "Company not found" })
        }

        let deleteClient = await clientModel.updateMany({ companyId: companyId }, { $set: { companyId: null } }, { new: true })

        return res.status(200).send({ status: true, message: "Company deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createCompany, loginCompany, addUser, removeUser, getCompany, updateCompany, deleteCompany }