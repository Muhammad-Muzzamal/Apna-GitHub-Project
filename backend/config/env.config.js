const dotenv = require("dotenv")

dotenv.config()

const ENV = {
    S3_BUCKET: process.env.S3_BUCKET,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRETE_KEY: process.env.AWS_SECRETE_KEY,
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRETE: process.env.JWT_SECRETE,
    JWT_REFRESH_SECRETE: process.env.JWT_REFRESH_SECRETE,
    NODE_ENV: process.env.NODE_ENV,


}

module.exports = {
    ENV
}