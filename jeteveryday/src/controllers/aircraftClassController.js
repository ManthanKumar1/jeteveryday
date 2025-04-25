let aircraftClassModel = require('../models/aircraftClassModel')
let { isValid, isValidObjectId } = require('../validator/validation')

let createAircraftClass = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { aircraftClass } = data

        if (!isValid(aircraftClass)) {
            return res.status(400).send({ status: false, message: message('Aircraft Class') })
        }

        let creteAircraftClass = await aircraftClassModel.create(data)

        return res.status(201).send({ status: true, message: "Aircraft Class created successfully", data: createAircraftClass })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getAircraftClass = async function (req, res) {
    try {
        let aircraftClassId = req.query.aircraftClassId

        if (aircraftClassId) {
            if (!isValid(aircraftClassId) && !isValidObjectId(aircraftClassId)) {
                return res.status(400).send({ status: false, message: message('Aircraft Class') })
            }

            let fetchAircraftClass = await aircraftClassModel.findOne({ _id: aircraftClassId, isDeleted: false })
            if (!fetchAircraftClass) {
                return res.status(404).send({ status: false, message: "Aircraft Class not found" })
            }

            return res.status(200).send({ status: true, message: "Your aircraft class", data: fetchAircraftClass })
        } else {
            let fetchAircraftClass = await aircraftClassModel.find({ isDeleted: false })
            if (fetchAircraftClass.length == 0) {
                return res.status(404).send({ status: false, message: "Aircraft Class not found" })
            }

            return res.status(200).send({ status: true, message: "All aircraft class", count: fetchAircraftClass.length, data: fetchAircraftClass })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateAircraftClass = async function (req, res) {
    try {
        let aircraftClassId = req.params.aircraftClassId
        if (!isValid(aircraftClassId) && !isValidObjectId(aircraftClassId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Class Id') })
        }

        let checkAircraftClass = await aircraftClassModel.findOne({ _id: aircraftClassId, isDeleted: false })
        if (!checkAircraftClass) {
            return res.status(404).send({ status: false, message: "Aircraft Class not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { aircraftClass } = data

        if (aircraftClass) {
            if (!isValid(aircraftClass)) {
                return res.status(400).send({ status: false, message: message('Aircraft Class') })
            }
        } else {
            aircraftClass = checkAircraftClass.aircraftClass
        }

        let updateAircraftClass = await aircraftClassModel.findOneAndUpdate({ _id: aircraftClassId }, { $set: data }, { new: true })

        return res.status(200).send({ status: true, message: "Aircraft Class updated successfully", data: updateAircraftClass })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteAircraftClass = async function (req, res) {
    try {
        let aircraftClassId = req.params.aircraftClassId
        if (!isValid(aircraftClassId) && !isValidObjectId(aircraftClassId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Class Id') })
        }

        let checkAircraftClass = await aircraftClassModel.findOne({ _id: aircraftClassId, isDeleted: false })
        if (!checkAircraftClass) {
            return res.status(404).send({ status: false, message: "Aircraft Class not found" })
        }

        let deleteAircraftClass = await aircraftClassModel.findOneAndUpdate({ _id: aircraftClassId }, { $set: { isDeleted: true } }, { new: true })

        return res.status(200).send({ status: true, message: "Aircraft Class deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createAircraftClass, getAircraftClass, updateAircraftClass, deleteAircraftClass }