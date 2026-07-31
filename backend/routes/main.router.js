const express = require("express")
const mainRouter = express.Router();
const userRouter = require("./user.router.js");
const issueRouter = require("./issue.router.js");
const repoRouter = require("./repo.router.js");

mainRouter.use(userRouter);
mainRouter.use("/issue/", issueRouter);
mainRouter.use("/repo/", repoRouter);

mainRouter.get("/", (req, res) => {
    res.send("wellcome");
});

module.exports = mainRouter;