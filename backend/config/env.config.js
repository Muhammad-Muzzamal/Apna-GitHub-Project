const dotenv = require("dotenv")

dotenv.config({ silent: true })

const ENV = {
    S3_BUCKET: process.env.S3_BUCKET
}

module.exports = {
    ENV
}