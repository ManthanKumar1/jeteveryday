let chatModel = require('../models/chatModel')

let createChat = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { queryId, serviceProviderId, clientId, text, isApproved } = data

        let createChat = await chatModel.create(data)

        return res.status(201).send({ status: true, message: "Chat created successfully", data: createChat })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createChat }