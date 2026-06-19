const fs = require("fs").promises;
const path = require("path");

async function initRepo() {

    const apnaGitPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(apnaGitPath, "commits");

    try {
        const bucket = process.env.S3_BUCKET;
        // if (!bucket) {
        //     console.error("S3_BUCKET environment variable is not set.");
        //     return;
        // }

        await fs.mkdir(apnaGitPath, { recursive: true })
        await fs.mkdir(commitsPath, { recursive: true })
        await fs.writeFile(
            path.join(apnaGitPath, "config.json"),
            JSON.stringify({ bucket }, null, 2)
        )

        console.log("Repository initialized successfully.");

    } catch (error) {
        console.log("Error in initialize repository", error);
        throw error;
    }

}


module.exports = {
    initRepo
}