let aircraftSubClassModel = require('../models/aircraftSubClassModel')
let aircraftClassModel = require('../models/aircraftClassModel')
let { isValid, isValidObjectId } = require('../validator/validation')

let createAircraftSubClass = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { aircraftClassId, subClass } = data

        if (!isValid(aircraftClassId) && !isValidObjectId(aircraftClassId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Class Id') })
        }

        let checkAircraftClass = await aircraftClassModel.findOne({ _id: aircraftClassId, isDeleted: false })
        if (!checkAircraftClass) {
            return res.status(404).send({ status: false, message: "Aircraft Class not found" })
        }

        if (!isValid(subClass)) {
            return res.status(400).send({ status: false, message: message('Sub Class') })
        }

        let createAircraftSubClass = await aircraftSubClassModel.create(data)

        return res.status(201).send({ status: true, message: "Aircraft Sub Class created successfully", data: createAircraftSubClass })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getAircraftSubClass = async function (req, res) {
    try {
        let { aircraftSubClassId, aircraftClassId } = req.query

        if (aircraftSubClassId && !aircraftClassId) {
            if (!isValid(aircraftSubClassId) && !isValidObjectId(aircraftSubClassId)) {
                return res.status(400).send({ status: false, message: message('Aircraft Sub Class Id') })
            }

            let fetchAircraft = await aircraftSubClassModel.findOne({ _id: aircraftSubClassId, isDeleted: false })
            if (!fetchAircraft) {
                return res.status(404).send({ status: false, message: "Aircraft Sub Class not found" })
            }

            return res.status(200).send({ status: true, message: "Your aircraft sub class", data: fetchAircraft })
        } else if (!aircraftSubClassId && aircraftClassId) {
            if (!isValid(aircraftClassId) && !isValidObjectId(aircraftClassId)) {
                return res.status(400).send({ status: false, message: message('Aircraft Class Id') })
            }

            let fetchAircraft = await aircraftSubClassModel.find({ aircraftClassId: aircraftClassId, isDeleted: false })
            if (fetchAircraft.length == 0) {
                return res.status(404).send({ status: false, message: "Aircraft Sub Class not found" })
            }

            return res.status(200).send({ status: true, message: "Your aircraft sub classes", count: fetchAircraft.length, data: fetchAircraft })
        } else {
            let fetchAircraft = await aircraftSubClassModel.find({ isDeleted: false })
            if (fetchAircraft.length == 0) {
                return res.status(404).send({ status: false, message: "Aircraft Sub Class not found" })
            }

            return res.status(200).send({ status: true, message: "All aircraft sub classes", count: fetchAircraft.length, data: fetchAircraft })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateAircraftSubClass = async function (req, res) {
    try {
        let aircraftSubClassId = req.params.aircraftSubClassId

        if (!isValid(aircraftSubClassId) && !isValidObjectId(aircraftSubClassId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Sub Class Id') })
        }

        let checkAircraft = await aircraftSubClassModel.findOne({ _id: aircraftSubClassId, isDeleted: false })
        if (!checkAircraft) {
            return res.status(404).send({ status: false, message: "Aircraft Sub Class not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { aircraftClassId, subClass } = data

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

        if (subClass) {
            if (!isValid(subClass)) {
                return res.status(400).send({ status: false, message: message('Sub Class') })
            }
        } else {
            subClass = checkAircraft.subClass
        }

        let updateAircraftSubClass = await aircraftSubClassModel.findOneAndUpdate({ _id: aircraftSubClassId }, { $set: data }, { new: true })

        return res.status(200).send({ status: true, message: "Aircraft Sub Class updated successfully", data: updateAircraftSubClass })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteAircraftSubClass = async function (req, res) {
    try {
        let aircraftSubClassId = req.params.aircraftSubClassId

        if (!isValid(aircraftSubClassId) && !isValidObjectId(aircraftSubClassId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Sub Class Id') })
        }

        let checkAircraft = await aircraftSubClassModel.findOne({ _id: aircraftSubClassId, isDeleted: false })
        if (!checkAircraft) {
            return res.status(404).send({ status: false, message: "Aircraft Sub Class not found" })
        }

        let deleteAircraftSubClass = await aircraftSubClassModel.findOneAndUpdate({ _id: aircraftSubClassId }, { $set: { isDeleted: true } }, { new: true })

        return res.status(200).send({ status: true, message: "Aircraft Sub Class deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createAircraftSubClass, getAircraftSubClass, updateAircraftSubClass, deleteAircraftSubClass }