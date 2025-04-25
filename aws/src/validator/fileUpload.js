let { MD5 } = require('md5-js-tools')
let fs = require('fs')

let allowedExtensions = ["png", "jpeg", "jpg", "pdf", "PNG", "JPEG", "JPG", "PDF"]

let processFile = (req, res, fieldName, folderName) => {
    let fileData = req.files.find(file => file.fieldname === fieldName)

    if (fileData) {
        let fileName = fileData.originalname
        let splitFileName = fileName.split('.')
        let fileExtension = splitFileName.pop()

        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).send({ status: false, message: `Allowed file extensions for ${fieldName}: png, jpg, jpeg, pdf` })
        }

        let newFileName = MD5.generate((new Date().getTime()).toString())
        let newPath = `./${folderName}/${newFileName}.${fileExtension}`

        fs.writeFile(newPath, fileData.buffer, function (err) {
            if (err) {
                return res.status(400).send({ status: false, message: err.message })
            }
        })

        let filePath = `https://airlogic.onrender.com/getImage/${newFileName}.${fileExtension}`
        return filePath
    } else {
        return null
    }
}

module.exports = { processFile }