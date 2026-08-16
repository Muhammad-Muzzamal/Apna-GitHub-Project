const { status } = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js");
const { ENV } = require("../config/env.config.js");
const { successResponse, errorResponse } = require("../helper/apiResponse.js");
const mongoose = require("mongoose");

/**
 * @route   GET /api/allUsers
 * @desc    Retrieve all registered users.
 *
 * This endpoint fetches all users from the database. If no users
 * exist, it returns a successful response with an empty array and
 * an appropriate message.
 *
 * @access  Public
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Users fetched successfully.",
 *   "data": {
 *     "users": [
 *       {
 *         "_id": "...",
 *         "username": "john_doe",
 *         "email": "john@example.com",
 *         ...
 *       }
 *     ]
 *   }
 * }
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "No users found.",
 *   "data": []
 * }
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while fetching users.
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length === 0) {
            return successResponse(res, "No users found.", { users }, status.OK);
        }
        return successResponse(res, "Users fetched successfully.", { users }, status.OK);
    } catch (error) {
        return errorResponse(res, `Internal server Error ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
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

        let hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // access token - Short lives
        const accessToken = jwt.sign(
            { id: user._id },
            ENV.JWT_SECRETE,
            { expiresIn: "15m" }
        )

        // refresh token long live
        const refreshToken = jwt.sign(
            { id: user._id },
            ENV.JWT_REFRESH_SECRETE,
            { expiresIn: "7d" }
        )

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh", // only sent to refresh endpoint
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: _, refreshToken: __, ...safeUser } = user.toObject();

        return successResponse(res, "User created successfully.", { safeUser }, status.CREATED);
    } catch (error) {
        console.log("Signup Error : ", error);
        return errorResponse(res, `Something went wrong. Please try again.`, status.INTERNAL_SERVER_ERROR);
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

        if (!email || !password) {
            return errorResponse(res, "Email and password are required.", status.BAD_REQUEST);
        }

        // check user exist or not
        const user = await User.findOne({ email }).select("+password");
        // user not found
        if (!user) {
            return errorResponse(res, "Invalid email or password.", status.UNAUTHORIZED);
        }

        // check password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        // if password is incorrect
        if (!isMatch) {
            return errorResponse(res, "Invalid email or password.", status.UNAUTHORIZED);
        }

        const accessToken = jwt.sign({ id: user._id }, ENV.JWT_SECRETE, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, ENV.JWT_REFRESH_SECRETE, { expiresIn: "7d" });

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: _, refreshToken: __, ...safeUser } = user.toObject();

        return successResponse(res, "User logged in successfully.", { user: safeUser }, status.OK);


    } catch (error) {
        console.error("Login error:", error);
        return errorResponse(res, "Something went wrong. Please try again.", status.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @desc    Fetch a user profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params
 * @param {string} req.params.id - MongoDB ObjectId of the user
 * @param {Object} res - Express response object
 *
 * @returns {Object} 200 - User fetched successfully
 * @returns {Object} 500 - Internal server error
 */
const getUserProfile = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "Invalid user ID.", status.BAD_REQUEST);
    }


    try {
        const user = await User.findById(id);

        if (!user) {
            return errorResponse(res, "User not found.", status.NOT_FOUND);
        }

        return successResponse(res, "User fetched successfully.", { user }, status.OK);
    } catch (error) {
        return errorResponse(res, `Internal Server Error ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @route   PUT /api/updateProfile/:id
 * @desc    Update a user's profile information.
 *
 * This endpoint updates the specified user's email and/or password.
 * If a new password is provided, it is securely hashed before being
 * stored in the database. Only the fields included in the request
 * body are updated.
 *
 * @access  Public
 *
 * @param
 * id - The unique MongoDB ObjectId of the user.
 *
 * @body
 * {
 *   "email": "newemail@example.com",      // Optional
 *   "password": "NewSecurePassword123"    // Optional
 * }
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "User profile updated successfully.",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "username": "john_doe",
 *       "email": "newemail@example.com",
 *       ...
 *     }
 *   }
 * }
 *
 * @error 400 Bad Request
 * Invalid user ID.
 *
 * @error 404 Not Found
 * User not found.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while updating the user profile.
 */
const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;

    // check validity of user id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "Invalid user ID.", status.BAD_REQUEST);
    }

    if (!email || !password) {
        return errorResponse(
            res,
            "Email and password are required.",
            status.BAD_REQUEST
        );
    }

    try {
        const isUserExist = await User.findById(id);
        if (!isUserExist) {
            return errorResponse(res, `User not found.`, status.NOT_FOUND);
        }
        const updatedFields = {};
        if (email) {
            updatedFields.email = email;
        }
        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true })
        return successResponse(
            res,
            "User profile updated successfully.",
            { user: updatedUser },
            status.OK
        );

    } catch (error) {
        return errorResponse(res, `Internal Server Error : ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @route   DELETE /api/deleteProfile/:id
 * @desc    Delete a user profile by its ID.
 *
 * This endpoint permanently removes the specified user from the
 * database. It first validates the provided user ID and ensures
 * that the user exists before performing the deletion.
 *
 * @access  Public
 *
 * @param
 * id - The unique MongoDB ObjectId of the user.
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "User deleted successfully.",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "username": "john_doe",
 *       "email": "john@example.com",
 *       ...
 *     }
 *   }
 * }
 *
 * @error 400 Bad Request
 * Invalid user ID.
 *
 * @error 404 Not Found
 * User not found.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while deleting the user.
 */
const deleteUserProfile = async (req, res) => {
    const { id } = req.params;
    // check validity if user is
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "Invalid user ID.", status.BAD_REQUEST);
    }

    try {
        const isUserExist = await User.findById(id);
        if (!isUserExist) {
            return errorResponse(res, `User not found.`, status.NOT_FOUND);
        }

        const deletedUser = await User.findByIdAndDelete(id);

        return successResponse(
            res,
            "User deleted successfully.",
            { user: deletedUser },
            status.OK
        );

    } catch (error) {
        return errorResponse(res, `Internal Server Error : ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @route   POST /api/auth/refresh
 * @desc    Issue a new access token using a valid refresh token.
 * @access  Public (relies on refreshToken cookie)
 */
const refreshToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            return errorResponse(res, "Refresh token missing. Please log in again.", status.UNAUTHORIZED);
        }

        // Verify the refresh token itself is valid/not expired
        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, ENV.JWT_REFRESH_SECRET);
        } catch (err) {
            return errorResponse(res, "Invalid or expired refresh token. Please log in again.", status.UNAUTHORIZED);
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return errorResponse(res, "User not found.", status.UNAUTHORIZED);
        }

        // Check it matches what we have stored (detects reuse/theft of an old token)
        if (user.refreshToken !== incomingRefreshToken) {
            // Someone is using a refresh token that's no longer valid/current
            // Optional: wipe all sessions here for safety
            user.refreshToken = undefined;
            await user.save();
            return errorResponse(res, "Refresh token reuse detected. Please log in again.", status.UNAUTHORIZED);
        }

        // Issue a new access token
        const newAccessToken = jwt.sign(
            { id: user._id },
            ENV.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Rotate the refresh token too (best practice)
        const newRefreshToken = jwt.sign(
            { id: user._id },
            ENV.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return successResponse(res, "Token refreshed successfully.", {}, status.OK);
    } catch (error) {
        console.error("Refresh token error:", error);
        return errorResponse(res, "Something went wrong. Please try again.", status.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    refreshToken
};