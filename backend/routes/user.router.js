const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller.js");

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/logout", userController.logout);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);
userRouter.post("/auth/refresh", userController.refreshToken);


module.exports = userRouter;