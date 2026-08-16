const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller.js");
const authMiddleware = require('../middleware/auth.middleware.js');

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/logout", authMiddleware, userController.logout);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);
userRouter.post("/auth/refresh", userController.refreshToken);
userRouter.get("/auth/me", authMiddleware, userController.getMe);


module.exports = userRouter;