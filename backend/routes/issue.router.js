const express = require("express");
const issueController = require("../controllers/issue.controller.js");
const issueRouter = express.Router();

issueRouter.post("/create", issueController.createIssue);
issueRouter.get("/all", issueController.getAllIssues);
issueRouter.get("/:id", issueController.getIssueById);
issueRouter.put("/:id", issueController.updateIssue);
issueRouter.delete("/:id", issueController.deleteIssue);

module.exports = issueRouter;