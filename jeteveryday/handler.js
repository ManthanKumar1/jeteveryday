'use strict'
let app = require('./src/index')
let serverless = require('serverless-http')

module.exports.hello = serverless(app)

// https://onjd6uol7j.execute-api.ap-south-1.amazonaws.com/dev
// https://xfbg0j4qc3.execute-api.ap-south-1.amazonaws.com/prod