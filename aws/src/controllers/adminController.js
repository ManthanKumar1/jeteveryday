let adminModel = require('../models/adminModel')
let serviceProviderModel = require('../models/serviceProviderModel')
let bookingModel = require('../models/bookingModel')
let flightModel = require('../models/flightModel')
const axios = require('axios')
let jwt = require('jsonwebtoken')
let argon2 = require('argon2')

let createAdmin = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { adminName, adminPhone, adminEmail, password } = data

        data.password = await argon2.hash(password)

        let createAdmin = await adminModel.create(data)

        return res.status(201).send({ status: true, message: "Admin created successfully", data: createAdmin })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let loginAdmin = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { adminEmail, password } = data

        let checkAdmin = await adminModel.findOne({ adminEmail: adminEmail, isDeleted: false })
        if (!checkAdmin) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        let checkPassword = await argon2.verify(checkAdmin.password, password)
        if (!checkPassword) {
            return res.status(400).send({ status: false, message: "Incorrect Password" })
        }

        let token = jwt.sign({
            adminId: checkAdmin._id.toString()
        }, "admin")

        let showData = {
            adminId: checkAdmin._id,
            token: token
        }

        return res.status(200).send({ status: true, message: 'Admin login successfully', data: showData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateToken = async function (req, res) {
    try {
        let adminId = '66cefb716c75108c1cb161b4'

        let checkAdmin = await adminModel.findOne({ _id: adminId, isDeleted: false })
        if (!checkAdmin) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { token } = data

        // token = 'dpTDpVMrSRq97yOq1B6dej:APA91bGOxFG8FzF5qYLZ-XkH8wUaC1RO-Aobr-T8M02T96KrCfFuHEBy4KZn1iarr1LjllddHiWzKiqd1Ga2u2O66mXWzPZTeXCL8HDp-dBZwOFf8pIlJiSPjZdKkFulwtrda0fq-Muu'

        let updateToken = await adminModel.findOneAndUpdate({ _id: adminId }, { $set: { token: token } }, { new: true })

        return res.status(200).send({ status: true, message: "Token updated successfully", data: updateToken })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let approveProvider = async function (req, res) {
    try {
        let adminId = '66cefb716c75108c1cb161b4'

        let checkAdmin = await adminModel.findOne({ _id: adminId, isDeleted: false })
        if (!checkAdmin) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { providerId } = data

        let updateProvider = await serviceProviderModel.findOneAndUpdate({ _id: providerId, isDeleted: false }, { $set: { isVerify: true } }, { new: true })

        return res.status(200).send({ status: true, message: "Provider verified successfully", data: updateProvider })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let confirmFlight = async function (req, res) {
    try {
        let adminId = '66cefb716c75108c1cb161b4'

        let checkAdmin = await adminModel.findOne({ _id: adminId, isDeleted: false })
        if (!checkAdmin) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { bookingId } = data

        let confirmFlight = await bookingModel.findOneAndUpdate({ _id: bookingId, isCancel: false, isConfirm: false }, { $set: { isConfirm: true } }, { new: true })
        if (!confirmFlight) {
            return res.status(404).send({ status: false, message: "Booking not found or already confirmed" })
        }

        let numberOfPassangers = parseInt(confirmFlight.numberOfPassangers)

        let flightId = confirmFlight.flightId

        let checkFlight = await flightModel.findOne({ _id: flightId, isCancel: false })
        if (!checkFlight) {
            return res.status(404).send({ status: false, message: "Flight not found" })
        }

        let numberOfSeat = checkFlight.numberOfSeat

        let numberOfBooking
        let booking = checkFlight.numberOfBooking

        booking = booking ? Number(booking) : 0

        if (booking == undefined || booking == null) {
            numberOfBooking = numberOfPassangers
        } else {
            numberOfBooking = booking + numberOfPassangers
        }

        let availableSeats = numberOfSeat - numberOfBooking

        if (numberOfBooking > numberOfSeat) {
            return res.status(400).send({ status: false, message: `Flight full. Only ${availableSeats} seats are available.` })
        }

        let updateFlight = await flightModel.findOneAndUpdate({ _id: flightId }, { $set: { numberOfBooking: numberOfBooking, availableSeats: availableSeats } }, { new: true })

        return res.status(200).send({ status: true, message: "Flight status approved", data: confirmFlight })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let sendNotification = async function (data) {
    try {
        let adminId = '66cefb716c75108c1cb161b4'

        let checkAdmin = await adminModel.findOne({ _id: adminId, isDeleted: false })

        let { authorization, token, body, title } = data;

        const url = 'https://fcm.googleapis.com/v1/projects/jeteveryday-794e2/messages:send';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authorization}`
        };

        const payload = {
            message: {
                token: token,
                notification: {
                    title: title,
                    body: body
                }
            }
        };

        const response = await axios.post(url, payload, { headers });

        return { status: true, message: "Notification sent successfully", data: response.data }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = { createAdmin, loginAdmin, updateToken, approveProvider, confirmFlight, sendNotification }