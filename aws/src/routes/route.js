let express = require('express')
let router = express.Router()

let { registerAndLogin, updateClient } = require('../controllers/clientController')
let { registerAndLoginProvider, getProvider, registrationForm } = require('../controllers/serviceProviderController')
let { createFlight, getFlight, cancelFlight, updateFlight, deleteFlight } = require('../controllers/flightController')
let { createBooking, getBooking, flightConfirm } = require('../controllers/bookingController')
let { createCharter, getCharter } = require('../controllers/charterController')
let { createQuery } = require('../controllers/queryController')
let { createChat } = require('../controllers/chatController')
let { sendEmail } = require('../controllers/email')
let { createAdmin, loginAdmin, updateToken, approveProvider, confirmFlight, sendNotification } = require('../controllers/adminController')
let { createCountry, createState, createCity, getCountry, getStates, getCity, getStateAndCity } = require('../address/countryController')

let { downloadPdf, download } = require('../validator/pdfGenerator')

router.get('/test', function (req, res) {
    return res.status(200).send({ status: true, message: 'Code run perfectly' })
})

// address
router.post('/createCountry', createCountry)
router.post('/createState', createState)
router.post('/createCity', createCity)
router.get('/getCountry', getCountry)
router.get('/getStates', getStates)
router.get('/getCity', getCity)
router.get('/getStateAndCity', getStateAndCity)

// pdf
router.post('/downloadPdf', downloadPdf)
router.get('/download/:filename', download)

// admin
router.post('/createAdmin', createAdmin)
router.post('/loginAdmin', loginAdmin)
router.post('/updateToken', updateToken)
router.post('/approveProvider', approveProvider)
router.post('/confirmFlight', confirmFlight)
router.post('/sendNotification', sendNotification)

// email
router.post('/sendEmail', sendEmail)

// client
// router.post('/sendOtp', sendOtp)
router.post('/registerAndLogin', registerAndLogin)
router.post('/updateClient/:clientId', updateClient)

// service provider
router.post('/registerAndLoginProvider', registerAndLoginProvider)
router.get('/getProvider', getProvider)
router.post('/registrationForm', registrationForm)

// flight
router.post('/createFlight', createFlight)
router.get('/getFlight', getFlight)
router.post('/cancelFlight/:flightId', cancelFlight)
router.post('/updateFlight/:flightId', updateFlight)
router.post('/deleteFlight/:flightId', deleteFlight)

// booking
router.post('/createBooking', createBooking)
router.get('/getBooking', getBooking) 
router.get('/flightConfirm', flightConfirm)

// charter
router.post('/createCharter', createCharter)
router.get('/getCharter', getCharter)

// query
router.post('/createQuery', createQuery)

// chat
router.post('/createChat', createChat)

module.exports = router