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

        let isUserExist = await User.findOne({ $or: [{ email }, { username }] });
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        // check user exist or not
        const user = await User.findOne({ email }).select("+password");
        // user not found
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({
                status: "error",
                message: "No account found for this email. Create an account to get started.",
                status_code: status.UNAUTHORIZED
            });
        }

        // check password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        // if password is incorrect
        if (!isMatch) {
            return res.status(status.UNAUTHORIZED).json({
                status: "error",
                message: "Invalid credentials. Please check your password.",
                status_code: status.UNAUTHORIZED
            });
        }

        const token = jwt.sign({ id: user._id }, ENV.JWT_SECRETE, { expiresIn: "1h" });

        return res.status(status.OK).json({
            status: "success",
            message: "User logged in successfully.",
            data: {
                user: user,
                token: token
            },
            status_code: status.OK
        });

    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: `Internal Server Error ${error.message}`,
            status_code: status.INTERNAL_SERVER_ERROR
        })
    }
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