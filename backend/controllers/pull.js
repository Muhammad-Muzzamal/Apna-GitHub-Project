const fs = require('fs').promises;
const path = require('path');
const { s3 } = require("../config/aws.config.js")
const { ENV } = require("../config/env.config.js")

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const data = await s3.listObjectsV2({ Bucket: ENV.S3_BUCKET, Prefix: 'commits/' }).promise();
        const objects = data.Contents;

        for (const obj of objects) {
            const key = obj.Key;
            const fileName = path.basename(key);
            const commitDir = path.dirname(key).split('/')[1];
            const commitPath = path.join(commitsPath, commitDir);

            await fs.mkdir(commitPath, { recursive: true });
            const params = { Bucket: ENV.S3_BUCKET, Key: key };

            const fileData = await s3.getObject(params).promise();
            const filePath = path.join(commitPath, fileName);
            await fs.writeFile(filePath, fileData.Body);

            console.log(`Pulled file: ${filePath}`);
        }

        console.log("Repository pulled successfully.");

    } catch (error) {
        console.error("Error occurred while pulling repository:", error);
    }
}

module.exports = {
    pullRepo
}