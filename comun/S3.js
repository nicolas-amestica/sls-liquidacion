'use strict';
const AWS = require('aws-sdk');
const fs = require('fs');

const S3 = new AWS.S3({
    s3ForcePathStyle: process.env.BUCKET_CONFIG_S3FORCEPATHSTYLE,
    accessKeyId: process.env.BUCKET_CONFIG_ACCESSKEYID,
    secretAccessKey: process.env.BUCKET_CONFIG_SECRETACCESSKEY,
    endpoint: new AWS.Endpoint(`${process.env.BUCKET_CONFIG_PROTOCOL}${process.env.BUCKET_CONFIG_ENDPOINT}:${process.env.BUCKET_CONFIG_PORT}`),
});

module.exports.uploadFromBuffer = async (fileName, data, bucketName, contentType) => {

    try {

        const buffer = Buffer.from(data, 'binary');

        let params = {
            Body: buffer,
            Key: `${fileName}`,
            Bucket: `${bucketName}`,
            ContentType: contentType,
        }

        let options = {};

        let result = await S3.upload(params, options).promise();

        return result;

    } catch (error) {

        return { error };

    }
}

module.exports.uploadFromFile = async (fileName, filePath, bucket) => {
    
    try {
            
        let bufferData = fs.readFileSync(filePath);

        let params = {
            Bucket: bucket,
            Key: fileName,
            Body: bufferData
        }

        var options = { };

        let result = await S3.upload(params, options).promise();

        return result;

    } catch (error) {

        return { error };

    }
}