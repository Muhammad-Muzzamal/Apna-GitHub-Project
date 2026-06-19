const AWS = require("aws-sdk");

AWS.config.update({ region : "ap-southeast-2"});

const s3 = new AWS.S3();

module.exports = {s3}
