const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init.js");
const { addFile } = require("./controllers/add.js");
const { commitChanges } = require("./controllers/commit.js");

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
        addFile)
    .command("commit <message>",
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
        ""
    )
    .demandCommand(1, "You need to specify a command.").help().argv;