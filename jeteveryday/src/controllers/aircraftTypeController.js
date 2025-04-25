let aircraftTypeModel = require('../models/aircraftTypeModel')
let aircraftSubClassModel = require('../models/aircraftSubClassModel')
let { isValid, isValidObjectId } = require('../validator/validation')

let createAircraftType = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { aircraftSubClassId, aircraftType } = data

        if (!isValid(aircraftSubClassId) && !isValidObjectId(aircraftSubClassId)) {
            return res.status(400).send({ status: false, message: message('Aircraft Sub Class Id') })
        }

        let checkAircraftSubClass = await aircraftSubClassModel.findOne({ _id: aircraftSubClassId, isDeleted: false })
        if(!checkAircraftSubClass){
            return res.status(404).send({status: false, message: "Aircraft Sub Class not found"})
        }

        data.aircraftClassId = checkAircraftSubClass.aircraftClassId

        if(!isValid(aircraftType)){
            return res.status(400).send({status: false, message: message('Aircraft Type')})
        }

        let createAircraftType = await aircraftTypeModel.create(data)

        return res.status(201).send({ status: true, message: "Aircraft Type created successfully", data: createAircraftType })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getAircraftType = async function (req, res){
    try {
        let {aircraftTypeId, aircraftClassId, aircraftSubClassId} = req.query

        if(aircraftTypeId && !aircraftClassId && !aircraftSubClassId){
            if(!isValid(aircraftTypeId) && !isValidObjectId(aircraftTypeId)){
                return res.status(400).send({status: false, message: message('Aircraft Type Id')})
            }

            
        }
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = { createAircraftType }