const fs = require("fs").promises;
const path = require("path");

async function addFile(filePath) {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const stagingPath = path.join(repoPath, "staging");

    try {
        await fs.mkdir(stagingPath, { recursive: true });
        const fileName = path.basename(filePath);

        await fs.copyFile(filePath, path.join(stagingPath, fileName));

        console.log(`Adding file: ${fileName} to staging area...`);
    } catch (error) {
        console.error("Error in adding file to staging area", error);
        throw error;
    }
}

module.exports = {
    addFile
}