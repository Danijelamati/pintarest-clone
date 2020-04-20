require('dotenv').config({ path: "../../.env" });

module.exports.githubConfig = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
};

module.exports.googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
};

module.exports.s3Config = {
    accessID: process.env.S3_ACCESS_KEY_ID,
    secretID: process.env.S3_SECRET_ACCESS_KEY
};

module.exports.s3Details = {
    bucketURL: process.env.S3_BUCKET_URL,
    bucketName: process.env.s3_BUCKET_NAME,
    bucketRegion: process.env.s3_BUCKET_REGION,
};

module.exports.adminInvite = process.env.ADMIN_INVITE;

