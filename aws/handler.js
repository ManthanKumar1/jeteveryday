'use strict'
let app = require('./src/index')
let serverless = require('serverless-http')

module.exports.hello = serverless(app)

// https://tpz99wtc9k.execute-api.ap-south-1.amazonaws.com/dev