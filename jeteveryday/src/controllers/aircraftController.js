let aircraftModel = require('../models/aircraftModel')
let aircraftClassModel = require('../models/aircraftClassModel')
let aircraftSubClassModel = require('../models/aircraftSubClassModel')
let companyModel = require('../models/companyModel')
let { isValid, isValidObjectId, message } = require('../validator/validation')

let createAircraft = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { companyId, aircraftClassId, aircraftSubClassId, registrationNumber, passengerCapacity, baggageCapacity, numberOfPilots, meal, lav, cabinCrew, interiorPic, exteriorPic } = data

        if (!isValid(companyId) && !isValidObjectId(companyId)) {
            return res.status(400).send({ status: false, message: message('Company Id') })
        }

        let checkCompany = await companyModel.findOne({ _id: companyId, isDeleted: false })
        if (!checkCompany) {
            return res.status(404).send({ status: false, message: "Company not found" })
        }

        if (!isValid(aircraftClassId) && !isValidObjectId(aircraftClassId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Class Id') })
        }

        let checkAircraftClass = await aircraftClassModel.findOne({ _id: aircraftClassId, isDeleted: false })
        if (!checkAircraftClass) {
            return res.status(404).send({ status: false, message: "Aircraft Class not found" })
        }

        if (!isValid(aircraftSubClassId) && !isValidObjectId(aircraftSubClassId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Sub Class Id') })
        }

        let checkAircraftSubClass = await aircraftSubClassModel.findOne({ _id: aircraftSubClassId, isDeleted: false })
        if (!checkAircraftSubClass) {
            return res.status(404).send({ status: false, message: "Aircraft Sub Class not found" })
        }

        if (!isValid(registrationNumber)) {
            return res.status(400).send({ status: false, message: message('Registration Number') })
        }

        let checkRegistrationNumber = await aircraftModel.findOne({ registrationNumber: registrationNumber, isDeleted: false })
        if (checkRegistrationNumber) {
            return res.status(400).send({ status: false, message: "Registration Number already in use" })
        }

        if (!isValid(passengerCapacity) || isNaN(passengerCapacity) || passengerCapacity <= 0) {
            return res.status(400).send({ status: false, message: message('Passenger Capacity') })
        }

        if (!isValid(baggageCapacity)) {
            return res.status(400).send({ status: false, message: message('Baggage Capacity') })
        }

        if (!isValid(numberOfPilots) || isNaN(numberOfPilots) || numberOfPilots <= 0) {
            return res.status(400).send({ status: false, message: message('Number Of Pilots') })
        }

        if (!isValid(meal) || !['Yes', 'No', 'May Be'].includes(meal)) {
            return res.status(400).send({ status: false, message: message('Meal') })
        }

        if (!isValid(lav) || !['Yes', 'No'].includes(lav)) {
            return res.status(400).send({ status: false, message: message('Lav') })
        }

        if (!isValid(cabinCrew) || !['Yes', 'No', 'May Be'].includes(cabinCrew)) {
            return res.status(400).send({ status: false, message: message('Cabin Crew') })
        }

        if (!Array.isArray(interiorPic) || interiorPic.some(pic => !isValid(pic))) {
            return res.status(400).send({ status: false, message: message('Interior Pictures') })
        }

        if (!Array.isArray(exteriorPic) || exteriorPic.some(pic => !isValid(pic))) {
            return res.status(400).send({ status: false, message: message('Exterior Pictures') })
        }

        let createAircraft = await aircraftModel.create(data)

        return res.status(201).send({ status: true, message: "Aircraft created successfully", data: createAircraft })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getAircraft = async function (req, res) {
    try {
        let { aircraftId, companyId, aircraftClassId, aircraftSubClassId } = req.query

        if (aircraftId && !companyId && !aircraftClassId && !aircraftSubClassId) {
            if (!isValid(aircraftId) && !isValidObjectId(aircraftId)) {
                return res.status(400).send({ status: false, message: message('Aircraft Id') })
            }

            let fetchAircraft = await aircraftModel.findOne({ _id: aircraftId, isDeleted: false })
            if (!fetchAircraft) {
                return res.status(404).send({ status: false, message: "Aircraft not found" })
            }

            return res.status(200).send({ status: true, message: "Your Aircraft", data: fetchAircraft })
        } else if (!aircraftId && companyId && !aircraftClassId && !aircraftSubClassId) {
            if (!isValid(companyId) && !isValidObjectId(companyId)) {
                return res.status(400).send({ status: false, message: message('Company Id') })
            }

            let fetchAircraft = await aircraftModel.find({ companyId: companyId, isDeleted: false })
            if (fetchAircraft.length == 0) {
                return res.status(404).send({ status: false, message: "Aircraft not found" })
            }

            return res.status(200).send({ status: true, message: "Your Aircraft", count: fetchAircraft.length, data: fetchAircraft })
        } else if (!aircraftId && !companyId && aircraftClassId && !aircraftSubClassId) {
            if (!isValid(aircraftClassId) && !isValidObjectId(aircraftClassId)) {
                return res.status(400).send({ status: false, message: message('Aircraft Class Id') })
            }

            let fetchAircraft = await aircraftModel.find({ aircraftClassId: aircraftClassId, isDeleted: false })
            if (fetchAircraft.length == 0) {
                return res.status(404).send({ status: false, message: "Aircraft not found" })
            }

            return res.status(200).send({ status: true, message: "Your Aircraft", count: fetchAircraft.length, data: fetchAircraft })
        } else if (!aircraftId && !companyId && !aircraftClassId && aircraftSubClassId) {
            if (!isValid(aircraftSubClassId) && !isValidObjectId(aircraftSubClassId)) {
                return res.status(400).send({ status: false, message: message('Aircraft Sub Class Id') })
            }

            let fetchAircraft = await aircraftModel.find({ aircraftSubClassId: aircraftSubClassId, isDeleted: false })
            if (fetchAircraft.length == 0) {
                return res.status(404).send({ status: false, message: "Aircraft not found" })
            }

            return res.status(200).send({ status: true, message: "Your Aircraft", count: fetchAircraft.length, data: fetchAircraft })
        } else {
            let fetchAircraft = await aircraftModel.find({ isDeleted: false })
            if (fetchAircraft.length == 0) {
                return res.status(404).send({ status: false, message: "Aircraft not found" })
            }

            return res.status(200).send({ status: true, message: "All Aircraft", count: fetchAircraft.length, data: fetchAircraft })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateAircraft = async function (req, res) {
    try {
        let aircraftId = req.params.aircraftId
        if (!isValid(aircraftId) && !isValidObjectId(aircraftId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Id') })
        }

        let checkAircraft = await aircraftModel.findOne({ _id: aircraftId, isDeleted: false })
        if (!checkAircraft) {
            return res.status(404).send({ status: false, message: "Aircraft not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { companyId, aircraftClassId, aircraftSubClassId, registrationNumber, passengerCapacity, baggageCapacity, numberOfPilots, meal, lav, cabinCrew, interiorPic, exteriorPic } = data

        if (companyId) {
            if (!isValid(companyId) && !isValidObjectId(companyId)) {
                return res.status(400).send({ status: false, message: message('Company Id') })
            }

            let checkCompany = await companyModel.findOne({ _id: companyId, isDeleted: false })
            if (!checkCompany) {
                return res.status(404).send({ status: false, message: "Company not found" })
            }
        } else {
            companyId = checkAircraft.companyId
        }

        if (aircraftClassId) {
            if (!isValid(aircraftClassId) && !isValidObjectId(aircraftClassId)) {
                return res.status(400).send({ status: false, message: message('Aircraft Class Id') })
            }

            let checkAircraftClass = await aircraftClassModel.findOne({ _id: aircraftClassId, isDeleted: false })
            if (!checkAircraftClass) {
                return res.status(404).send({ status: false, message: "Aircraft Class not found" })
            }
        } else {
            aircraftClassId = checkAircraft.aircraftClassId
        }

        if (aircraftSubClassId) {
            if (!isValid(aircraftSubClassId) && !isValidObjectId(aircraftSubClassId)) {
                return res.status(400).send({ status: false, message: message('Aircraft Sub Class Id') })
            }

            let checkAircraftSubClass = await aircraftSubClassModel.findOne({ _id: aircraftSubClassId, isDeleted: false })
            if (!checkAircraftSubClass) {
                return res.status(404).send({ status: false, message: "Aircraft Sub Class not found" })
            }
        } else {
            aircraftSubClassId = checkAircraft.aircraftSubClassId
        }

        if (registrationNumber) {
            if (!isValid(registrationNumber)) {
                return res.status(400).send({ status: false, message: message('Registration Number') })
            }

            if (registrationNumber != checkAircraft.registrationNumber) {
                let checkRegistrationNumber = await aircraftModel.findOne({ registrationNumber: registrationNumber, isDeleted: false })
                if (checkRegistrationNumber) {
                    return res.status(400).send({ status: false, message: "Registration Number already in use" })
                }
            }
        } else {
            registrationNumber = checkAircraft.registrationNumber
        }

        if (passengerCapacity) {
            if (!isValid(passengerCapacity) || isNaN(passengerCapacity) || passengerCapacity <= 0) {
                return res.status(400).send({ status: false, message: message('Passenger Capacity') })
            }
        } else {
            passengerCapacity = checkAircraft.passengerCapacity
        }

        if (baggageCapacity) {
            if (!isValid(baggageCapacity)) {
                return res.status(400).send({ status: false, message: message('Baggage Capacity') })
            }
        } else {
            baggageCapacity = checkAircraft.baggageCapacity
        }

        if (numberOfPilots) {
            if (!isValid(numberOfPilots) || isNaN(numberOfPilots) || numberOfPilots <= 0) {
                return res.status(400).send({ status: false, message: message('Number Of Pilots') })
            }
        } else {
            numberOfPilots = checkAircraft.numberOfPilots
        }

        if (meal) {
            if (!isValid(meal) || !['Yes', 'No', 'May Be'].includes(meal)) {
                return res.status(400).send({ status: false, message: message('Meal') })
            }
        } else {
            meal = checkAircraft.meal
        }

        if (lav) {
            if (!isValid(lav) || !['Yes', 'No'].includes(lav)) {
                return res.status(400).send({ status: false, message: message('Lav') })
            }
        } else {
            lav = checkAircraft.lav
        }

        if (cabinCrew) {
            if (!isValid(cabinCrew) || !['Yes', 'No', 'May Be'].includes(cabinCrew)) {
                return res.status(400).send({ status: false, message: message('Cabin Crew') })
            }
        } else {
            cabinCrew = checkAircraft.cabinCrew
        }

        if (interiorPic) {
            if (!Array.isArray(interiorPic) || interiorPic.some(pic => !isValid(pic))) {
                return res.status(400).send({ status: false, message: message('Interior Pictures') })
            }
        } else {
            interiorPic = checkAircraft.interiorPic
        }

        if (exteriorPic) {
            if (!Array.isArray(exteriorPic) || exteriorPic.some(pic => !isValid(pic))) {
                return res.status(400).send({ status: false, message: message('Exterior Pictures') })
            }
        } else {
            exteriorPic = checkAircraft.exteriorPic
        }

        let updateData = { companyId, aircraftClassId, aircraftSubClassId, registrationNumber, passengerCapacity, baggageCapacity, numberOfPilots, meal, lav, cabinCrew, interiorPic, exteriorPic }

        let updateAircraft = await aircraftModel.findOneAndUpdate({ _id: aircraftId }, { $set: updateData }, { new: true })

        return res.status(200).send({ status: true, message: "Aircraft updated successfully", data: updateAircraft })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteAircraft = async function (req, res) {
    try {
        let aircraftId = req.params.aircraftId
        if (!isValid(aircraftId) && !isValidObjectId(aircraftId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Id') })
        }

        let checkAircraft = await aircraftModel.findOne({ _id: aircraftId, isDeleted: false })
        if (!checkAircraft) {
            return res.status(404).send({ status: false, message: "Aircraft not found" })
        }

        let deleteAircraft = await aircraftModel.findOneAndUpdate({ _id: aircraftId }, { $set: { isDeleted: false } }, { new: true })

        return res.status(200).send({ status: true, message: "Aircraft deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createAircraft, getAircraft, updateAircraft, deleteAircraft }