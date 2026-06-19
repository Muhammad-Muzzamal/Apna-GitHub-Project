const AWS = require("aws-sdk");

AWS.config.update({ region: "ap-southeast-2" });

const s3 = new AWS.s3();

module.exports = { s3 }
