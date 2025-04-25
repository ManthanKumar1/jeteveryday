const mongoose = require('mongoose')

let isValid = function (value) {
    if (!value || typeof value === "undefined" || value === null || typeof value != 'string') return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

let isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

let message = function (value) {
    return `${value} is missing or invalid`
}

let isValidPhone = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/

let isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

let isValidPriority = /^(10|[1-9])$/

module.exports = { isValid, isValidObjectId, message, isValidPhone, isValidEmail, isValidPriority }