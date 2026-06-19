const { ENV } = require("../config/env.config.js")
const fs = require("fs").promises;
const path = require("path");
const { s3 } = require("../config/aws.config.js")

async function pushCommand() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit")
    const commitsPath = path.join(repoPath, "commits")

    try {
        const commitDirs = await fs.readdir(commitsPath)

        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir)
            const files = await fs.readdir(commitPath)

            // console.log(files)

            for (const file of files) {
                const filePath = path.join(commitPath, file)
                const fileContent = await fs.readFile(filePath)
                const params = {
                    Bucket: ENV.S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent
                }

                await s3.upload(params).promise()
            }
            console.log("All commits are pushed")
        }
    } catch (error) {
        console.error("Error in push", error.message)
        throw error;
    }
}

module.exports = { pushCommand }