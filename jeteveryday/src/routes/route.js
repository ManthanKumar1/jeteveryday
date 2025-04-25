let express = require('express')
let router = express.Router()

let { loginAndVerify, getClient, updateClient, clientStatus, deleteClient } = require('../controllers/clientController')
let { createCompany, loginCompany, addUser, removeUser, getCompany, updateCompany, deleteCompany } = require('../controllers/companyController')
let { createAircraft, getAircraft, updateAircraft, deleteAircraft } = require('../controllers/aircraftController')

let { createAircraftClass, getAircraftClass, updateAircraftClass, deleteAircraftClass } = require('../controllers/aircraftClassController')
let { createAircraftSubClass, getAircraftSubClass, updateAircraftSubClass, deleteAircraftSubClass } = require('../controllers/aircraftSubClassController')
let {createAircraftType} = require('../controllers/aircraftTypeController')

let { createCountry, createState, createCity, getCountry, getStateAndCity } = require('../address/countryController')

// authentications
let { authenticationClient } = require('../middlewares/clientAuth')
let { authenticationCompany } = require('../middlewares/companyAuth')

// test api
router.get('/test', function (req, res) {
    return res.status(200).send({ status: true, message: 'Code run perfectly' })
})

// address
router.post('/createCountry', createCountry)
router.post('/createState', createState)
router.post('/createCity', createCity)
router.get('/getCountry', getCountry)
router.get('/getStateAndCity', getStateAndCity)

// client
router.post('/loginAndVerify', loginAndVerify)
router.get('/getClient', getClient)
router.post('/updateClient/:clientId', updateClient)
router.post('/clientStatus/:clientId', clientStatus)
router.post('/deleteClient/:clientId', deleteClient)

// company
router.post('/createCompany', createCompany)
router.post('/loginCompany', loginCompany)
router.post('/addUser/:companyId', addUser)
router.post('/removeUser/:companyId', removeUser)
router.get('/getCompany', getCompany)
router.post('/updateCompany/:companyId', updateCompany)
router.post('/deleteCompany/:companyId', deleteCompany)

// aircraft class
router.post('/createAircraftClass', createAircraftClass)
router.get('/getAircraftClass', getAircraftClass)
router.post('/updateAircraftClass/:aircraftClassId', updateAircraftClass)
router.post('/deleteAircraftClass/:aircraftClassId', deleteAircraftClass)

// aircraft sub class
router.post('/createAircraftSubClass', createAircraftSubClass)
router.get('/getAircraftSubClass', getAircraftSubClass)
router.post('/updateAircraftSubClass/:aircraftClassId', updateAircraftSubClass)
router.post('/deleteAircraftSubClass/:aircraftClassId', deleteAircraftSubClass)

// aircraft type
router.post('/createAircraftType', createAircraftType)

module.exports = router