const express = require("express")
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init.js");
const { addFile } = require("./controllers/add.js");
const { commitChanges } = require("./controllers/commit.js");
const { pushCommand } = require("./controllers/push.js");
const { pullRepo } = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");
const { ENV } = require("./config/env.config.js");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.config.js");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

yargs(hideBin(process.argv))
    .command("start", "Start a new Server", {}, startServer)
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
        (argv) => {
            commitChanges(argv.message)
        }
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


async function startServer() {
    try {

        const app = express();
        app.use(express.json());
        app.use(cors({ origin: '*' }));

        app.get("/", (req, res) => {
            res.json({ message: "Wellcome" })
        })

        await connectDB();

        const httpServer = http.createServer(app);
        const io = new Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        })

        let user;

        io.on("connection", (socket) => {
            socket.on("joinRoom", (userID) => {
                user = userID;
                console.log("=======")
                console.log(user)
                console.log("=======")
                socket.join(userID);
            })
        })

        const db = mongoose.connection;
        db.once("open", async () => {
            console.log("CRUD operation Called");
            // TODO: CRUD operations
        })


        httpServer.listen(ENV.PORT, () => {
            console.log(`App is listening on http://localhost:${ENV.PORT}`)
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

