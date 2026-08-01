const { status } = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js");
const { ENV } = require("../config/env.config.js");
const { successResponse, errorResponse } = require("../helper/apiResponse.js")

const getAllUsers = (req, res) => {
    return res.send("All users fetched.");
}

/**
 * @route   POST /api/signup
 * @desc    Register a new user account.
 *
 * This endpoint creates a new user after validating the required
 * input fields (username, email, and password). It ensures that
 * both the username and email are unique, securely hashes the
 * password using bcrypt, stores the user in the database, and
 * generates a JWT authentication token for the newly registered user.
 *
 * @access  Public
 *
 * @body
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "password": "SecurePassword123"
 * }
 *
 * @success 201 Created
 * {
 *   "success": true,
 *   "message": "User created successfully.",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "username": "john_doe",
 *       "email": "john@example.com",
 *       ...
 *     },
 *     "token": "JWT_TOKEN"
 *   }
 * }
 *
 * @error 400 Bad Request
 * Missing required fields (username, email, or password).
 *
 * @error 409 Conflict
 * Username or email already exists.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while creating the user.
 */
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

/**
 * @route   POST /api/login
 * @desc    Authenticate an existing user and return a JWT access token.
 *
 * This endpoint verifies the user's email and password. If the
 * credentials are valid, it generates a JSON Web Token (JWT)
 * that can be used to access protected routes.
 *
 * @access  Public
 *
 * @body
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePassword123"
 * }
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "User logged in successfully.",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "username": "john_doe",
 *       "email": "john@example.com",
 *       ...
 *     },
 *     "token": "JWT_TOKEN"
 *   }
 * }
 *
 * @error 401 Unauthorized
 * No account found for the provided email.
 *
 * @error 401 Unauthorized
 * Invalid password or credentials.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while processing the login request.
 */
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