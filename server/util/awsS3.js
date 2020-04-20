const AWS = require("aws-sdk");

const {s3Config, s3Details} = require("./config");

const s3 = new AWS.S3({    
    accessKeyId: s3Config.accessID,
    secretAccessKey: s3Config.secretID,
    region: s3Details.bucketRegion
});

module.exports = s3;