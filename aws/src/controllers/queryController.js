let queryModel = require('../models/queryModel')
let charterModel = require('../models/charterModel')

let createQuery = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { clientId, charterId, serviceProviderId, from, to, flyDate, boardingTime, landingTime, myPrice } = data

        let checkCharter = await charterModel.findOne({ _id: charterId, isDeleted: false })
        if (!checkCharter) {
            return res.status(404).send({ status: false, message: "Charter not found" })
        }
        data.serviceProviderId = checkCharter.serviceProviderId

        let createQuery = await queryModel.create(data)

        return res.status(201).send({ status: true, message: "Query created successfully", data: createQuery })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createQuery }