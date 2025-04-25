let countryModel = require('../address/countryModel')
let stateModel = require('../address/stateModel')
let cityModel = require('../address/cityModel')
let { isValid, isValidObjectId, message } = require('../validator/validation')

let createCountry = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { country } = data

        if (!isValid(country)) {
            return res.status(400).send({ status: false, message: message('Country Name') })
        }

        let createCountry = await countryModel.create(data)

        return res.status(201).send({ status: true, message: "Country created successfully", data: createCountry })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let createState = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { countryId, state } = data

        if (!isValid(countryId) && !isValidObjectId(countryId)) {
            return res.status(400).send({ status: false, message: message('Country Id') })
        }

        let checkCountry = await countryModel.findOne({ _id: countryId, isDeleted: false })
        if (!checkCountry) {
            return res.status(404).send({ status: false, message: "Country not found" })
        }

        if (!isValid(state)) {
            return res.status(400).send({ status: false, message: message('State Name') })
        }

        let createState = await stateModel.create(data)

        return res.status(201).send({ status: true, message: "State created successfully", data: createState })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let createCity = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { countryId, stateId, city } = data

        if (!isValid(stateId) && !isValidObjectId(stateId)) {
            return res.status(400).send({ status: false, message: message('State Id') })
        }

        let checkState = await stateModel.findOne({ _id: stateId, isDeleted: false })
        if (!checkState) {
            return res.status(404).send({ status: false, message: "State not found" })
        }

        data.countryId = checkState.countryId

        if (!isValid(city)) {
            return res.status(400).send({ status: false, message: message('City Name') })
        }

        let createCity = await cityModel.create(data)

        return res.status(201).send({ status: true, message: "City created successfully", data: createCity })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getCountry = async function (req, res) {
    try {
        let countryId = req.query.countryId

        if (countryId) {
            if (!isValid(countryId) && !isValidObjectId(countryId)) {
                return res.status(400).send({ status: false, message: message('Country Id') })
            }

            let fetchCountry = await countryModel.findOne({ _id: countryId, isDeleted: false }).select({ country: 1, _id: 0 })
            if (!fetchCountry) {
                return res.status(404).send({ status: false, message: "Country not found" })
            }

            return res.status(200).send({ status: true, message: "Your Country", data: fetchCountry })
        } else {
            let fetchCountry = await countryModel.find({ isDeleted: false }).select({ country: 1, _id: 0 }).sort({ country: 1 })
            if (fetchCountry.length == 0) {
                return res.status(404).send({ status: false, message: "Country not found" })
            }

            return res.status(200).send({ status: true, message: "All Country", count: fetchCountry.length, data: fetchCountry })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getStates = async function (req, res) {
    try {
        let stateId = req.query.stateId

        if (stateId) {
            if (!isValid(stateId) && !isValidObjectId(stateId)) {
                return res.status(400).send({ status: false, message: message('State Id') })
            }

            let fetchState = await stateModel.findOne({ _id: stateId, isDeleted: false }).select({ state: 1, _id: 0 })
            if (!fetchState) {
                return res.status(404).send({ status: false, message: "States not found" })
            }

            return res.status(200).send({ status: true, message: "Your State", data: fetchState })
        } else {
            let fetchStates = await stateModel.find({ isDeleted: false }).select({ state: 1, _id: 0 }).sort({ state: 1 })
            if (fetchStates.length == 0) {
                return res.status(404).send({ status: false, message: "States not found" })
            }

            return res.status(200).send({ status: true, message: "All States", count: fetchStates.length, data: fetchStates })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getCity = async function (req, res) {
    try {
        let cityId = req.query.cityId

        if (cityId) {
            if (!isValid(cityId) && !isValidObjectId(cityId)) {
                return res.status(400).send({ status: false, message: message('City Id') })
            }

            let fetchCity = await cityModel.findOne({ _id: cityId, isDeleted: false }).select({ city: 1, _id: 0 })
            if (!fetchCity) {
                return res.status(404).send({ status: false, message: "City not found" })
            }

            return res.status(200).send({ status: true, message: "Your State", data: fetchCity })
        } else {
            let fetchCities = await cityModel.find({ isDeleted: false }).select({ city: 1, _id: 0 }).sort({ city: 1 })
            if (fetchCities.length == 0) {
                return res.status(404).send({ status: false, message: "Cities not found" })
            }

            return res.status(200).send({ status: true, message: "All Cities", count: fetchCities.length, data: fetchCities })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getStateAndCity = async function (req, res) {
    try {
        let countryId = req.query.countryId
        let stateId = req.query.stateId
        let cityId = req.query.cityId

        if (countryId && !stateId && !cityId) {
            if (!isValid(countryId) && !isValidObjectId(countryId)) {
                return res.status(400).send({ status: false, message: message('Country Id') })
            }

            let fetchState = await stateModel.find({ countryId: countryId, isDeleted: false }).select({ state: 1, _id: 0 }).sort({ state: 1 })
            if (fetchState.length == 0) {
                return res.status(404).send({ status: false, message: "State not found" })
            }

            return res.status(200).send({ status: true, message: "Your states", count: fetchState.length, data: fetchState })
        } else if (!countryId && stateId && !cityId) {
            if (!isValid(stateId) && !isValidObjectId(stateId)) {
                return res.status(400).send({ status: false, message: message('State Id') })
            }

            let fetchCity = await cityModel.find({ stateId: stateId, isDeleted: false }).select({ city: 1, _id: 0 }).sort({ city: 1 })
            if (fetchCity.length == 0) {
                return res.status(404).send({ status: false, message: "City not found" })
            }

            return res.status(200).send({ status: true, message: "Your states", count: fetchCity.length, data: fetchCity })
        } else if (!countryId && !stateId && cityId) {
            if (!isValid(cityId) && !isValidObjectId(cityId)) {
                return res.status(400).send({ status: false, message: message('City Id') })
            }

            let fetchCity = await cityModel.findOne({ _id: cityId, isDeleted: false }).select({ city: 1, _id: 0 })
            if (!fetchCity) {
                return res.status(404).send({ status: false, message: "City not found" })
            }

            return res.status(200).send({ status: true, message: "Your city", data: fetchCity })
        } else {
            return res.status(400).send({ status: false, message: "Validation not match" })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createCountry, createState, createCity, getCountry, getStates, getCity, getStateAndCity }