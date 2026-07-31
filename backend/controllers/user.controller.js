const { status } = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js");
const { ENV } = require("../config/env.config.js");

const getAllUsers = (req, res) => {
    return res.send("All users fetched.");
}

const signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(status.BAD_REQUEST).json({
                status: "error",
                message: "Username, Email and password are required.",
                status_code: status.BAD_REQUEST
            })
        }

        let isUserExist = await User.findOne({ $or: [{ email, username }] });
        if (isUserExist) {

            const duplicatedField = isUserExist.email === email ? "Email" : "Username";

            return res.status(status.CONFLICT).json({
                status: "error",
                message: `${duplicatedField} already exists`,
                status_code: status.CONFLICT

            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // generate token
        const token = jwt.sign(
            { id: user._id },
            ENV.JWT_SECRETE,
            { expiresIn: "1h" }
        )

        return res.status(status.CREATED).json({
            status: "success",
            message: "User created successfully.",
            data: {
                user: user,
                token: token
            },
            status_code: status.CREATED
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: `Internal Server Error ${error.message}`,
            status_code: status.INTERNAL_SERVER_ERROR
        })
    }
}

const login = (req, res) => {
    return res.send("Logging in!");
}

const getUserProfile = (req, res) => {
    return res.send("user profile fetched.");
}

const updateUserProfile = (req, res) => {
    return res.send("user profile updated.");
}

const deleteUserProfile = (req, res) => {
    return res.send("user profile deleted.");
}

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};