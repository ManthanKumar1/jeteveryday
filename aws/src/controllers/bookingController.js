let bookingModel = require('../models/bookingModel')
let clientModel = require('../models/clientModel')
let flightModel = require('../models/flightModel')
let serviceProviderModel = require('../models/serviceProviderModel')
let adminModel = require('../models/adminModel')
let { sendNotification } = require('../controllers/adminController')
let { sendEmail } = require('./email')

let createBooking = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { flightId, serviceProviderId, clientId, numberOfPassangers, authorization, body, title } = data

        let checkClient = await clientModel.findOne({ _id: clientId, isDeleted: false })
        if (!checkClient) {
            return res.status(404).send({ status: false, message: "Client not found" })
        }

        numberOfPassangers = Number(numberOfPassangers)

        let checkFlight = await flightModel.findOne({ _id: flightId, isCancel: false })
        if (!checkFlight) {
            return res.status(404).send({ status: false, message: "Flight not found" })
        }
        data.serviceProviderId = checkFlight.serviceProviderId

        let availableSeats = checkFlight.numberOfSeat - checkFlight.numberOfBooking

        if (numberOfPassangers > availableSeats) {
            return res.status(400).send({ status: false, message: `Flight full. Only ${availableSeats} seats are available.` })
        }

        let checkServiceProvider = await serviceProviderModel.findOne({ _id: checkFlight.serviceProviderId, isDeleted: false })
        if (!checkServiceProvider) {
            return res.status(404).send({ status: false, message: "Service Provider not found" })
        }

        // let numberOfBooking
        // let booking = checkFlight.numberOfBooking

        // booking = booking ? Number(booking) : 0

        // if (booking == undefined || booking == null) {
        //     numberOfBooking = numberOfPassangers
        // } else {
        //     numberOfBooking = booking + numberOfPassangers
        // }

        // let updateFlight = await flightModel.findOneAndUpdate({ _id: flightId }, { $set: { numberOfBooking: numberOfBooking } }, { new: true })

        let createBooking = await bookingModel.create(data)

        let flightDetails = {
            flight: checkFlight.planeType,
            date: checkFlight.planeDate,
            departureLocation: checkFlight.from,
            departureTime: checkFlight.boardingTime,
            arrivalLocation: checkFlight.to,
            arrivalTime: checkFlight.landingTime,
            pricePerSeat: checkFlight.perSeatPrice,
            charteredPrice: checkFlight.charteredPrice,
            numberOfSeat: checkFlight.numberOfSeat,
            numberOfPassengers: numberOfPassangers,
        }

        let serviceProviderDetails = {
            name: checkServiceProvider.companyName,
            contact: checkServiceProvider.companyNumber,
        }

        await sendEmail(checkClient.clientName, checkClient.email, checkClient.phoneNumber, flightDetails, serviceProviderDetails)

        let adminId = '66cefb716c75108c1cb161b4'

        let checkAdmin = await adminModel.findOne({ _id: adminId, isDeleted: false })
        if (!checkAdmin) {
            return res.status(404).send({ status: false, message: "Admin not found" })
        }

        let token = checkAdmin.token

        const notificationResponse = await sendNotification({ authorization, token, body, title });
        if (!notificationResponse.status) {
            return res.status(500).send({ status: false, message: notificationResponse.message });
        }

        return res.status(201).send({ status: true, message: "Booked", data: createBooking })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getBooking = async function (req, res) {
    try {
        let bookingId = req.query.bookingId
        let flightId = req.query.flightId
        let serviceProviderId = req.query.serviceProviderId
        let clientId = req.query.clientId

        if (bookingId && !flightId && !serviceProviderId && !clientId) {
            let fetchBooking = await bookingModel.findOne({ _id: bookingId, isCancel: false, isConfirm: true })
            if (!fetchBooking) {
                return res.status(404).send({ status: false, message: "Booking not found" })
            }
            let flight = fetchBooking.flightId
            let client = fetchBooking.clientId

            let fetchFlight = await flightModel.findOne({ _id: flight, isCancel: false })
            if (!fetchFlight) {
                return res.status(404).send({ status: false, message: "flight not found" })
            }

            let fetchClient = await clientModel.findOne({ _id: client, isDeleted: false })
            if (!fetchClient) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            let data = {
                _id: fetchFlight._id,
                clientId: fetchBooking.clientId,
                bookingId: fetchBooking._id,
                planePic: fetchFlight.planePic,
                planeType: fetchFlight.planeType,
                planeDate: fetchFlight.planeDate,
                boardingTime: fetchFlight.boardingTime,
                landingTime: fetchFlight.landingTime,
                from: fetchFlight.from,
                to: fetchFlight.to,
                numberOfSeat: fetchFlight.numberOfSeat,
                charteredPrice: fetchFlight.charteredPrice,
                perSeatPrice: fetchFlight.perSeatPrice,
                numberOfBooking: fetchFlight.numberOfBooking,
                availableSeats: fetchFlight.availableSeats,
                numberOfPassangers: fetchBooking.numberOfPassangers,
                clientName: fetchClient.clientName,
                clientPhone: fetchClient.phoneNumber,
                clientEmail: fetchClient.email,
                isConfirm: fetchBooking.isConfirm
            }

            return res.status(200).send({ status: true, message: "Your booking", data: data })
        } else if (!bookingId && flightId && !serviceProviderId && !clientId) {
            let fetchBooking = await bookingModel.find({ flightId: flightId, isCancel: false, isConfirm: true })
            if (fetchBooking.length == 0) {
                return res.status(404).send({ status: false, message: "Booking not found" })
            }

            let arr = []

            for (let i = 0; i < fetchBooking.length; i++) {
                let client = fetchBooking[i].clientId

                let fetchClient = await clientModel.findOne({ _id: client, isDeleted: false })
                if (!fetchClient) {
                    return res.status(404).send({ status: false, message: "Client not found" })
                }

                let fetchFlight = await flightModel.findOne({ _id: flightId, isCancel: false })
                if (!fetchFlight) {
                    return res.status(404).send({ status: false, message: "flight not found" })
                }

                let data = {
                    _id: fetchFlight._id,
                    clientId: fetchBooking[i].clientId,
                    bookingId: fetchBooking[i]._id,
                    planePic: fetchFlight.planePic,
                    planeType: fetchFlight.planeType,
                    planeDate: fetchFlight.planeDate,
                    boardingTime: fetchFlight.boardingTime,
                    landingTime: fetchFlight.landingTime,
                    from: fetchFlight.from,
                    to: fetchFlight.to,
                    numberOfSeat: fetchFlight.numberOfSeat,
                    charteredPrice: fetchFlight.charteredPrice,
                    perSeatPrice: fetchFlight.perSeatPrice,
                    numberOfBooking: fetchFlight.numberOfBooking,
                    availableSeats: fetchFlight.availableSeats,
                    numberOfPassangers: fetchBooking[i].numberOfPassangers,
                    clientName: fetchClient.clientName,
                    clientPhone: fetchClient.phoneNumber,
                    clientEmail: fetchClient.email,
                    isConfirm: fetchBooking[i].isConfirm
                }

                arr.push(data)
            }

            return res.status(200).send({ status: true, message: "Your booking", count: fetchBooking.length, data: arr })
        } else if (!bookingId && !flightId && serviceProviderId && !clientId) {
            let fetchBooking = await bookingModel.find({ serviceProviderId: serviceProviderId, isCancel: false, isConfirm: true })
            if (fetchBooking.length == 0) {
                return res.status(404).send({ status: false, message: "Booking not found" })
            }

            let arr = []

            for (let i = 0; i < fetchBooking.length; i++) {
                let flight = fetchBooking[i].flightId
                let client = fetchBooking[i].clientId

                let fetchClient = await clientModel.findOne({ _id: client, isDeleted: false })
                if (!fetchClient) {
                    return res.status(404).send({ status: false, message: "Client not found" })
                }

                let fetchFlight = await flightModel.findOne({ _id: flight, isCancel: false })
                if (!fetchFlight) {
                    return res.status(404).send({ status: false, message: "flight not found" })
                }

                let data = {
                    _id: fetchFlight._id,
                    clientId: fetchBooking[i].clientId,
                    bookingId: fetchBooking[i]._id,
                    planePic: fetchFlight.planePic,
                    planeType: fetchFlight.planeType,
                    planeDate: fetchFlight.planeDate,
                    boardingTime: fetchFlight.boardingTime,
                    landingTime: fetchFlight.landingTime,
                    from: fetchFlight.from,
                    to: fetchFlight.to,
                    numberOfSeat: fetchFlight.numberOfSeat,
                    charteredPrice: fetchFlight.charteredPrice,
                    perSeatPrice: fetchFlight.perSeatPrice,
                    numberOfBooking: fetchFlight.numberOfBooking,
                    availableSeats: fetchFlight.availableSeats,
                    numberOfPassangers: fetchBooking[i].numberOfPassangers,
                    clientName: fetchClient.clientName,
                    clientPhone: fetchClient.phoneNumber,
                    clientEmail: fetchClient.email,
                    isConfirm: fetchBooking[i].isConfirm
                }

                arr.push(data)
            }

            return res.status(200).send({ status: true, message: "Your booking", count: fetchBooking.length, data: arr })
        } else if (!bookingId && !flightId && !serviceProviderId && clientId) {
            let fetchBooking = await bookingModel.find({ clientId: clientId, isCancel: false })
            if (fetchBooking.length == 0) {
                return res.status(404).send({ status: false, message: "Booking not found" })
            }

            let arr = []

            for (let i = 0; i < fetchBooking.length; i++) {
                let flight = fetchBooking[i].flightId

                let fetchFlight = await flightModel.findOne({ _id: flight, isCancel: false })
                if (!fetchFlight) {
                    return res.status(404).send({ status: false, message: "flight not found" })
                }

                let fetchClient = await clientModel.findOne({ _id: clientId, isDeleted: false })
                if (!fetchClient) {
                    return res.status(404).send({ status: false, message: "Client not found" })
                }

                let data = {
                    _id: fetchFlight._id,
                    clientId: fetchBooking[i].clientId,
                    bookingId: fetchBooking[i]._id,
                    planePic: fetchFlight.planePic,
                    planeType: fetchFlight.planeType,
                    planeDate: fetchFlight.planeDate,
                    boardingTime: fetchFlight.boardingTime,
                    landingTime: fetchFlight.landingTime,
                    from: fetchFlight.from,
                    to: fetchFlight.to,
                    numberOfSeat: fetchFlight.numberOfSeat,
                    charteredPrice: fetchFlight.charteredPrice,
                    perSeatPrice: fetchFlight.perSeatPrice,
                    numberOfBooking: fetchFlight.numberOfBooking,
                    availableSeats: fetchFlight.availableSeats,
                    numberOfPassangers: fetchBooking[i].numberOfPassangers,
                    clientName: fetchClient.clientName,
                    clientPhone: fetchClient.phoneNumber,
                    clientEmail: fetchClient.email,
                    isConfirm: fetchBooking[i].isConfirm
                }

                arr.push(data)
            }

            return res.status(200).send({ status: true, message: "Your booking", count: fetchBooking.length, data: arr })
        } else {
            let fetchBooking = await bookingModel.find({ isCancel: false, isConfirm: false })
            if (fetchBooking.length == 0) {
                return res.status(404).send({ status: false, message: "Booking not found" })
            }

            let arr = []

            for (let i = 0; i < fetchBooking.length; i++) {
                let flight = fetchBooking[i].flightId
                let client = fetchBooking[i].clientId

                let fetchClient = await clientModel.findOne({ _id: client, isDeleted: false })
                if (!fetchClient) {
                    return res.status(404).send({ status: false, message: "Client not found" })
                }

                let fetchFlight = await flightModel.findOne({ _id: flight, isCancel: false })
                if (!fetchFlight) {
                    return res.status(404).send({ status: false, message: "flight not found" })
                }

                let data = {
                    _id: fetchFlight._id,
                    clientId: fetchBooking[i].clientId,
                    bookingId: fetchBooking[i]._id,
                    planePic: fetchFlight.planePic,
                    planeType: fetchFlight.planeType,
                    planeDate: fetchFlight.planeDate,
                    boardingTime: fetchFlight.boardingTime,
                    landingTime: fetchFlight.landingTime,
                    from: fetchFlight.from,
                    to: fetchFlight.to,
                    numberOfSeat: fetchFlight.numberOfSeat,
                    charteredPrice: fetchFlight.charteredPrice,
                    perSeatPrice: fetchFlight.perSeatPrice,
                    numberOfBooking: fetchFlight.numberOfBooking,
                    availableSeats: fetchFlight.availableSeats,
                    numberOfPassangers: fetchBooking[i].numberOfPassangers,
                    clientName: fetchClient.clientName,
                    clientPhone: fetchClient.phoneNumber,
                    clientEmail: fetchClient.email,
                    isConfirm: fetchBooking[i].isConfirm
                }

                arr.push(data)
            }

            return res.status(200).send({ status: true, message: "All booking", count: fetchBooking.length, data: arr })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let flightConfirm = async function (req, res) {
    try {
        let fetchBooking = await bookingModel.find({ isCancel: false, isConfirm: true })
        if (fetchBooking.length == 0) {
            return res.status(404).send({ status: false, message: "Booking not found" })
        }

        let arr = []

        for (let i = 0; i < fetchBooking.length; i++) {
            let flight = fetchBooking[i].flightId
            let client = fetchBooking[i].clientId

            let fetchClient = await clientModel.findOne({ _id: client, isDeleted: false })
            if (!fetchClient) {
                return res.status(404).send({ status: false, message: "Client not found" })
            }

            let fetchFlight = await flightModel.findOne({ _id: flight, isCancel: false })
            if (!fetchFlight) {
                return res.status(404).send({ status: false, message: "flight not found" })
            }

            let data = {
                _id: fetchFlight._id,
                clientId: fetchBooking[i].clientId,
                bookingId: fetchBooking[i]._id,
                planePic: fetchFlight.planePic,
                planeType: fetchFlight.planeType,
                planeDate: fetchFlight.planeDate,
                boardingTime: fetchFlight.boardingTime,
                landingTime: fetchFlight.landingTime,
                from: fetchFlight.from,
                to: fetchFlight.to,
                numberOfSeat: fetchFlight.numberOfSeat,
                charteredPrice: fetchFlight.charteredPrice,
                perSeatPrice: fetchFlight.perSeatPrice,
                numberOfBooking: fetchFlight.numberOfBooking,
                availableSeats: fetchFlight.availableSeats,
                numberOfPassangers: fetchBooking[i].numberOfPassangers,
                clientName: fetchClient.clientName,
                clientPhone: fetchClient.phoneNumber,
                clientEmail: fetchClient.email,
                isConfirm: fetchBooking[i].isConfirm
            }

            arr.push(data)
        }

        return res.status(200).send({ status: true, message: "All booking", count: fetchBooking.length, data: arr })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createBooking, getBooking, flightConfirm }