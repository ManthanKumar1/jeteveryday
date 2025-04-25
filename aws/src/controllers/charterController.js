let charterModel = require('../models/charterModel')

let createCharter = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { serviceProviderId, planeType, model, seats } = data

        let createCharter = await charterModel.create(data)

        return res.status(201).send({ status: true, message: "Charter created successfully", data: createCharter })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getCharter = async function (req, res) {
    try {
        let charterId = req.query.charterId
        let serviceProviderId = req.query.serviceProviderId

        if (charterId) {
            let fetchCharter = await charterModel.findOne({ _id: charterId, isDeleted: false })
            if (!fetchCharter) {
                return res.status(404).send({ status: false, message: "Charter not found" })
            }

            return res.status(200).send({ status: true, message: "Your charter", data: fetchCharter })
        } else if (serviceProviderId) {
            let fetchCharter = await charterModel.find({ serviceProviderId: serviceProviderId, isDeleted: false })
            if (fetchCharter.length == 0) {
                return res.status(404).send({ status: false, message: "Charter not found" })
            }

            return res.status(200).send({ status: true, message: "Your charter", count: fetchCharter.length, data: fetchCharter })
        } else {
            let fetchCharter = await charterModel.find({ isDeleted: false })
            if (fetchCharter.length == 0) {
                return res.status(404).send({ status: false, message: "Charter not found" })
            }

            return res.status(200).send({ status: true, message: "Your charter", count: fetchCharter.length, data: fetchCharter })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createCharter, getCharter }