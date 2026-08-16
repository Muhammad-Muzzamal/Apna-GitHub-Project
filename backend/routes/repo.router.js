const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const repoRouter = express.Router();

const repoController = require("../controllers/repo.controller.js");

repoRouter.post("/create", authMiddleware, repoController.createRepository);
repoRouter.get("/all", repoController.getAllRepositories); // public browsing - fine as is
repoRouter.get("/id/:id", repoController.fetchRepositoriesById); // public - fine
repoRouter.get("/name/:name", repoController.fetchRepositoriesByName); // public - fine
repoRouter.get("/user/me", authMiddleware, repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/update/:id", authMiddleware, repoController.updateRepository);
repoRouter.patch("/toggle-visibility/:id", authMiddleware, repoController.toggleVisibilityById);
repoRouter.delete("/delete/:id", authMiddleware, repoController.deleteRepositoryById);

module.exports = repoRouter;