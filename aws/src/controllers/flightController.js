const bookingModel = require('../models/bookingModel')
let flightModel = require('../models/flightModel')

let createFlight = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { serviceProviderId, planePic, planeType, planeDate, boardingTime, landingTime, from, to, numberOfSeat, charteredPrice, perSeatPrice } = data

        if (planeType == 'Turbo Prop') {
            planePic = 'https://i.postimg.cc/LsC2n3c5/Turbo-Prop.png'
        } else if (planeType == 'Jet') {
            planePic = 'https://i.postimg.cc/V6J1MbwR/Light-Jet.png'
        } else if (planeType == 'Helicopter') {
            planePic = 'https://i.postimg.cc/g0kGzTB1/Helicopter.png'
        } else {
            return res.status(400).send({ status: false, message: "Invalid type of Aircraft Type" })
        }

        let createFlight = await flightModel.create({ serviceProviderId: serviceProviderId, planePic: planePic, planeType: planeType, planeDate: planeDate, boardingTime: boardingTime, landingTime: landingTime, from: from, to: to, numberOfSeat: numberOfSeat, availableSeats: numberOfSeat, charteredPrice: charteredPrice, perSeatPrice: perSeatPrice, })

        return res.status(201).send({ status: true, message: "Flight created successfully", data: createFlight })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// let getFlight = async function (req, res) {
//     try {
//         let from = req.query.from ? req.query.from.trim() : null
//         let to = req.query.to ? req.query.to.trim() : null
//         let flightId = req.query.flightId ? req.query.flightId.trim() : null
//         let isCancel = req.query.isCancel ? req.query.isCancel.trim() : null

//         if (from && to && !flightId && !isCancel) {
//             let fetchFlight = await flightModel.find({ from: from, to: to, isCancel: false }).sort({ planeDate: 1, boardingTime: 1 })
//             if (fetchFlight.length == 0) {
//                 return res.status(404).send({ status: false, message: "Flight not found" })
//             }

//             return res.status(200).send({ status: true, message: "Your flights", count: fetchFlight.length, data: fetchFlight })
//         } else if (!from && !to && flightId && !isCancel) {
//             let fetchFlight = await flightModel.findOne({ _id: flightId, isCancel: false })
//             if (!fetchFlight) {
//                 return res.status(404).send({ status: false, message: "Flight not found" })
//             }

//             return res.status(200).send({ status: true, message: "Your flights", count: fetchFlight.length, data: fetchFlight })
//         } else if (!from && !to && !flightId && isCancel) {
//             let fetchFlight = await flightModel.find({ isCancel: isCancel }).sort({ planeDate: 1, boardingTime: 1 })
//             if (fetchFlight.length == 0) {
//                 return res.status(404).send({ status: false, message: "Flight not found" })
//             }

//             return res.status(200).send({ status: true, message: "Your flights", count: fetchFlight.length, data: fetchFlight })
//         } else if (!from && !to && !flightId && !isCancel) {
//             let fetchFlight = await flightModel.find().sort({ planeDate: 1, boardingTime: 1 })
//             if (fetchFlight.length == 0) {
//                 return res.status(404).send({ status: false, message: "Flight not found" })
//             }

//             return res.status(200).send({ status: true, message: "All flights", count: fetchFlight.length, data: fetchFlight })
//         } else {
//             return res.status(400).send({ status: false, message: "Validation not match" })
//         }
//     } catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }

// let getFlight = async function (req, res) {
//     try {
//         let from = req.query.from ? req.query.from.trim() : null
//         let to = req.query.to ? req.query.to.trim() : null
//         let flightId = req.query.flightId ? req.query.flightId.trim() : null
//         let serviceProviderId = req.query.serviceProviderId ? req.query.serviceProviderId.trim() : null
//         let isCancel = req.query.isCancel ? req.query.isCancel.trim() : null

//         let now = new Date()

//         let filter = {
//             planeDate: { $gte: now.toISOString().split('T')[0] },
//             isCancel: false
//         }

//         if (from && to && !flightId && !serviceProviderId && !isCancel) {
//             filter.from = from
//             filter.to = to
//         } else if (!from && !to && flightId && !serviceProviderId && !isCancel) {
//             filter._id = flightId
//         } else if (!from && !to && !flightId && serviceProviderId && !isCancel) {
//             filter.serviceProviderId = serviceProviderId
//         } else if (!from && !to && !flightId && !serviceProviderId && isCancel) {
//             filter.isCancel = isCancel === 'true'
//         } else if (!from && !to && !flightId && !serviceProviderId && !isCancel) {
//             filter = filter
//         } else {
//             return res.status(400).send({ status: false, message: "Validation not match" })
//         }

//         let fetchFlight = await flightModel.find(filter).sort({ planeDate: 1, boardingTime: 1 })

//         if (filter.planeDate === now.toISOString().split('T')[0]) {
//             fetchFlight = fetchFlight.filter(flight => new Date(`${flight.planeDate}T${flight.boardingTime}`) > now)
//         }

//         if (fetchFlight.length == 0) {
//             return res.status(404).send({ status: false, message: "Flight not found" })
//         }

//         return res.status(200).send({ status: true, message: "Your flights", count: fetchFlight.length, data: fetchFlight })
//     } catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }

let getFlight = async function (req, res) {
    try {
        let from = req.query.from ? req.query.from.trim() : null
        let to = req.query.to ? req.query.to.trim() : null
        let flightId = req.query.flightId ? req.query.flightId.trim() : null
        let serviceProviderId = req.query.serviceProviderId ? req.query.serviceProviderId.trim() : null
        let isCancel = req.query.isCancel ? req.query.isCancel.trim() : null

        let now = new Date()

        let filter = {
            isCancel: false,
        }

        if (from && to && !flightId && !serviceProviderId && !isCancel) {
            filter.from = from
            filter.to = to
        } else if (from && !to && !flightId && !serviceProviderId && !isCancel) {
            filter.from = from
        } else if (!from && to && !flightId && !serviceProviderId && !isCancel) {
            filter.to = to
        } else if (!from && !to && flightId && !serviceProviderId && !isCancel) {
            filter._id = flightId
        } else if (!from && !to && !flightId && serviceProviderId && !isCancel) {
            filter.serviceProviderId = serviceProviderId
        } else if (!from && !to && !flightId && !serviceProviderId && isCancel) {
            filter.isCancel = isCancel === 'true'
        } else if (!from && !to && !flightId && !serviceProviderId && !isCancel) {
            filter = filter
        } else {
            return res.status(400).send({ status: false, message: "Validation not match" })
        }

        let fetchFlight = await flightModel.find(filter).sort({ planeDate: 1, boardingTime: 1 })

        fetchFlight = fetchFlight.filter(flight => {
            let [day, month, year] = flight.planeDate.split('/')
            let flightDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
            let [boardingHour, boardingMinutes, period] = flight.boardingTime.split(/[:\s]/)
            boardingHour = parseInt(boardingHour, 10)
            if (period === 'PM' && boardingHour !== 12) boardingHour += 12
            if (period === 'AM' && boardingHour === 12) boardingHour = 0

            let flightDateTime = new Date(flightDate.getFullYear(), flightDate.getMonth(), flightDate.getDate(), boardingHour, parseInt(boardingMinutes, 10))

            return flightDateTime > now
        })

        fetchFlight.sort((a, b) => {
            let [dayA, monthA, yearA] = a.planeDate.split('/')
            let [dayB, monthB, yearB] = b.planeDate.split('/')
            let dateA = new Date(`${yearA}-${monthA.padStart(2, '0')}-${dayA.padStart(2, '0')}`)
            let dateB = new Date(`${yearB}-${monthB.padStart(2, '0')}-${dayB.padStart(2, '0')}`)

            let [hourA, minA, periodA] = a.boardingTime.split(/[:\s]/)
            let [hourB, minB, periodB] = b.boardingTime.split(/[:\s]/)
            hourA = parseInt(hourA, 10)
            hourB = parseInt(hourB, 10)
            if (periodA === 'PM' && hourA !== 12) hourA += 12
            if (periodA === 'AM' && hourA === 12) hourA = 0
            if (periodB === 'PM' && hourB !== 12) hourB += 12
            if (periodB === 'AM' && hourB === 12) hourB = 0

            let dateTimeA = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), hourA, parseInt(minA, 10))
            let dateTimeB = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), hourB, parseInt(minB, 10))

            return dateTimeA - dateTimeB
        })

        if (fetchFlight.length === 0) {
            return res.status(404).send({ status: false, message: "Flight not found" })
        }

        return res.status(200).send({ status: true, message: "Your flights", count: fetchFlight.length, data: fetchFlight })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let cancelFlight = async function (req, res) {
    try {
        let flightId = req.params.flightId

        let checkFlight = await flightModel.findOne({ _id: flightId, isCancel: false })
        if (!checkFlight) {
            return res.status(404).send({ status: false, message: "Flight not found" })
        }

        let cancelFlight = await flightModel.findOneAndUpdate({ _id: flightId }, { $set: { isCancel: true } }, { new: true })

        return res.status(200).send({ status: true, message: "Flight cancel successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateFlight = async function (req, res) {
    try {
        let flightId = req.params.flightId

        let checkFlight = await flightModel.findOne({ _id: flightId, isCancel: false })
        if (!checkFlight) {
            return res.status(404).send({ status: false, message: "Flight not found" })
        }

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { serviceProviderId, planePic, planeType, planeDate, boardingTime, landingTime, from, to, numberOfSeat, charteredPrice, perSeatPrice } = data

        let updateFlight = await flightModel.findOneAndUpdate({ _id: flightId }, { $set: data }, { new: true })

        return res.status(200).send({ status: true, message: "Flight updated successfully", data: updateFlight })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteFlight = async function (req, res) {
    try {
        let flightId = req.params.flightId

        let checkFlight = await flightModel.findOne({ _id: flightId, isCancel: false })
        if (!checkFlight) {
            return res.status(404).send({ status: false, message: "Flight not found" })
        }

        let deleteFlight = await flightModel.findOneAndUpdate({ _id: flightId }, { $set: { isCancel: true } }, { new: true })

        let deleteBooking = await bookingModel.updateMany({ flightId: flightId }, { $set: { isCancel: true } }, { new: true })

        return res.status(200).send({ status: true, message: "Flight deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createFlight, getFlight, cancelFlight, updateFlight, deleteFlight }