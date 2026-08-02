const mongoose = require("mongoose");
const { default: status } = require("http-status");
const { errorResponse, successResponse } = require("../helper/apiResponse.js");
const Repo = require("../models/repo.model.js");
const Issue = require("../models/issue.model.js");
const User = require("../models/user.model.js");

/**
 * @route   POST /api/repo/create
 * @desc    Create a new repository for a user.
 *
 * This endpoint creates a new repository after validating the
 * required fields. It verifies that the repository name is
 * provided, the owner ID is valid, the owner exists, and that
 * another repository with the same name does not already exist
 * for the same owner.
 *
 * @access  Public
 *
 * @body
 * {
 *   "name": "my-first-repo",
 *   "description": "A sample repository.",      // Optional
 *   "content": [],                              // Optional
 *   "visibility": true,                         // Optional (true = public, false = private)
 *   "owner": "64f0b2b5b4c123456789abcd",
 *   "issues": []                                // Optional
 * }
 *
 * @success 201 Created
 * {
 *   "success": true,
 *   "message": "Repository is created.",
 *   "data": {
 *     "_id": "...",
 *     "name": "my-first-repo",
 *     "description": "A sample repository.",
 *     "visibility": true,
 *     "owner": "64f0b2b5b4c123456789abcd",
 *     ...
 *   }
 * }
 *
 * @error 400 Bad Request
 * Repository name is missing or empty.
 *
 * @error 400 Bad Request
 * Owner ID is missing or invalid.
 *
 * @error 404 Not Found
 * Owner not found.
 *
 * @error 409 Conflict
 * A repository with the same name already exists for the specified owner.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while creating the repository.
 */
exports.createRepository = async (req, res) => {
    const {
        name,
        description,
        content,
        visibility,
        owner,
        issues
    } = req.body;
    
    // if name is not required
    if (!name || !name.trim()) {
        return errorResponse(
            res,
            `Repository name is required.`,
            status.BAD_REQUEST
        );
    }

    // owner is required and valid
    if (!owner) {
        return errorResponse(
            res,
            `Owner is required.`,
            status.BAD_REQUEST
        );
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
        return errorResponse(
            res,
            `Owner is Invalid.`,
            status.BAD_REQUEST
        );
    }


    try {

        const ownerExists = await User.findById(owner);

        if (!ownerExists) {
            return errorResponse(
                res,
                "Owner not found.",
                status.NOT_FOUND
            );
        }
        const repoName = name.trim().toLowerCase().replace(/\s+/g, "-");

        const existingRepo = await Repo.findOne({ owner, name: repoName });
        if (existingRepo) {
            return errorResponse(res, "Repository already exists.", status.CONFLICT)
        }

        const repo = await Repo.create({
            name: repoName,
            description,
            content,
            visibility,
            owner,
            issues
        });

        return successResponse(
            res,
            "Repository is created.",
            repo,
            status.CREATED
        )

    } catch (error) {
        return errorResponse(
            res,
            `Internal Server Error ${error.message}`,
            status.INTERNAL_SERVER_ERROR
        )
    }
}

exports.getAllRepositories = (req, res) => {
    return res.send("All Repositories");
}

exports.fetchRepositoriesById = (req, res) => {
    return res.send("All Repositories By Id");
}

exports.fetchRepositoriesByName = (req, res) => {
    return res.send("All Repositories By Name");
}

exports.fetchRepositoriesForCurrentUser = (req, res) => {
    return res.send("All Repositories For Current User");
}

exports.updateRepository = (req, res) => {
    return res.send("Repository Updated");
}

exports.toggleVisibilityById = (req, res) => {
    return res.send("Repository Visibility Toggled");
}

exports.deleteRepositoryById = (req, res) => {
    return res.send("Repository Deleted");
}