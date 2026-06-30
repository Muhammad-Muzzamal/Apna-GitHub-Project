const AWS = require("aws-sdk");
const { ENV } = require("./env.config.js")

AWS.config.update({
    region: "ap-southeast-2",
    accessKeyId: ENV.AWS_ACCESS_KEY,
    secretAccessKey: ENV.AWS_SECRETE_KEY
});

const s3 = new AWS.S3();

module.exports = { s3 }
