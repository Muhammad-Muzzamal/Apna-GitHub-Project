const { errorResponse, } = require("../helper/apiResponse.js")
const { status } = require("http-status");
const { ENV } = require("../config/env.config.js");
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken")

/**
 * @desc    Protect routes by verifying the access token cookie.
 * Attaches the decoded user payload to req.user if valid.
 */
const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return errorResponse(res, "Not authenticated. Please log in.", status.UNAUTHORIZED);
        }

        let decoded;
        try {

            decoded = jwt.verify(accessToken, ENV.JWT_SECRETE);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return errorResponse(res, "Access token expired.", status.UNAUTHORIZED);
            }
            return errorResponse(res, "Invalid access token.", status.UNAUTHORIZED);
        }

        const user = await User.findById(decoded.id).select("-password -refreshToken");
        if (!user) {
            return errorResponse(res, "User not found.", status.UNAUTHORIZED);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return errorResponse(res, "Something went wrong. Please try again.", status.INTERNAL_SERVER_ERROR);
    }
};

module.exports = authMiddleware;