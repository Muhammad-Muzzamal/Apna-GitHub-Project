const dotenv = require("dotenv")

dotenv.config()

const ENV = {
    S3_BUCKET: process.env.S3_BUCKET,
    AWS_REGION: process.env.AWS_REGION
}

module.exports = {
    ENV
}