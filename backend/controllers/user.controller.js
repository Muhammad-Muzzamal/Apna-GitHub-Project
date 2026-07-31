const { status } = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js");
const { ENV } = require("../config/env.config.js");
const { successResponse, errorResponse } = require("../helper/apiResponse.js")

const getAllUsers = (req, res) => {
    return res.send("All users fetched.");
}

const signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        if (!username || !email || !password) {
            return errorResponse(res, "Username, email, and password are required.", status.BAD_REQUEST);
        }

        let isUserExist = await User.findOne({ $or: [{ email }, { username }] });
        if (isUserExist) {

            const duplicatedField = isUserExist.email === email ? "Email" : "Username";
            return errorResponse(
                res,
                `${duplicatedField} already exists`,
                status.CONFLICT
            )
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
        return successResponse(res, "User created successfully.", { user, token }, status.CREATED);
    } catch (error) {
        return errorResponse(res, `Internal Server Error ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        // check user exist or not
        const user = await User.findOne({ email }).select("+password");
        // user not found
        if (!user) {
            return errorResponse(
                res,
                "No account found for this email. Create an account to get started.",
                status.UNAUTHORIZED
            );
        }

        // check password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        // if password is incorrect
        if (!isMatch) {
            return errorResponse(
                res,
                "Invalid credentials. Please check your password.",
                status.UNAUTHORIZED
            )
        }

        const token = jwt.sign({ id: user._id }, ENV.JWT_SECRETE, { expiresIn: "1h" });

        return successResponse(res, "User logged in successfully.", { user, token }, status.OK);


    } catch (error) {
        return errorResponse(res, `Internal Server Error ${error.message}`, status.INTERNAL_SERVER_ERROR);
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