const yargs = require("yargs");
const dotenv = require("dotenv");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init.js");
const { addFile } = require("./controllers/add.js");
const { commitChanges } = require("./controllers/commit.js");
const { pushCommand } = require("./controllers/push.js");
const { pullRepo } = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");

dotenv.config({ silent: true });

yargs(hideBin(process.argv))
    .command(
        'init',
        "Initialize a new repository.",
        {},
        initRepo)
    .command(
        'add <file>',
        "Add files to the staging area.",
        (yargs) => {
            yargs.positional("file", {
                describe: "The file(s) to add.",
                type: "string",
            })
        },
        (argv) => {
            addFile(argv.file)

        }
    )
    .command(
        "commit <message>",
        "Commit changes with a message.",
        (yargs) => {
            yargs.positional("message", {
                describe: "The commit message.",
                type: "string",
            })
        },
        commitChanges
    )
    .command(
        "push",
        "code pushed to server",
        {},
        pushCommand
    )
    .command(
        "pull",
        "code pulled from server",
        {},
        pullRepo
    )
    .command(
        "revert <commitID>",
        "Revert to a specific commit.",
        (yargs) => {
            yargs.positional("commitID", {
                describe: "The ID of the commit to revert to.",
                type: "string",
            })
        },
        revertRepo
    )
    .demandCommand(1, "You need to specify a command.").help().argv;