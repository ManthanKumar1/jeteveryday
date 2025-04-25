let express = require('express')
let mongoose = require('mongoose')
let app = express()
let multer = require('multer')
let cors = require('cors')
let router = require('./routes/route')

app.use(express.json())

app.use(multer().any())

app.use(cors({
    origin: '*'
}))

mongoose.connect("mongodb+srv://airlogic:Office%40205@cluster0.278zo.mongodb.net/airlogic")
    .then(() => console.log("mongodb is connected"))
    .catch(error => console.log(error))

app.use('/', router)

app.use(function (req, res) {
    return res.status(400).send({ status: false, message: "Path Not Found" })
})

module.exports = app

// app.listen(process.env.PORT || 3000, function () {
//     console.log("Express app running on Port " + (process.env.PORT || 3000))
// })