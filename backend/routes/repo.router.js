const express = require("express");
const repoRouter = express.Router();

const repoController = require("../controllers/repo.controller.js");

repoRouter.post("/create", repoController.createRepository);
repoRouter.get("/all", repoController.getAllRepositories);
repoRouter.get("/id/:id", repoController.fetchRepositoriesById);
repoRouter.get("/name/:name", repoController.fetchRepositoriesByName);
repoRouter.get("/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/update/:id", repoController.updateRepository);
repoRouter.patch("/toggle-visibility/:id", repoController.toggleVisibilityById);
repoRouter.delete("/delete/:id", repoController.deleteRepositoryById);

module.exports = repoRouter;