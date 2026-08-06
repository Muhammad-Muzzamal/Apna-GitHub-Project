const mongoose = require("mongoose");
const { default: status } = require("http-status");
const { errorResponse, successResponse } = require("../helper/apiResponse.js");
const Repo = require("../models/repo.model.js");
const Issue = require("../models/issue.model.js");
const User = require("../models/user.model.js");
const { slugify } = require("../helper/slugify.js");
const jwt = require("jsonwebtoken")
const { ENV } = require("../config/env.config.js")

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
        const repoName = slugify(name);

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

/**
 * @route   GET /api/repo/all
 * @desc    Retrieve all repositories.
 *
 * This endpoint fetches all repositories from the database and
 * returns them in the response.
 *
 * @access  Public
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "All repositories fetched.",
 *   "data": [
 *     {
 *       "_id": "...",
 *       "name": "my-first-repo",
 *       "description": "A sample repository.",
 *       "visibility": true,
 *       "owner": "64f0b2b5b4c123456789abcd",
 *       ...
 *     }
 *   ]
 * }
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while fetching repositories.
 */
exports.getAllRepositories = async (req, res) => {
    try {
        const repos = await Repo.find({}).lean();

        if (repos.length === 0) {
            return errorResponse(
                res,
                `No repository found.`,
                status.NOT_FOUND
            );
        }

        return successResponse(res, "All repositories fetched.", repos, status.OK);
    } catch (error) {
        return errorResponse(
            res,
            `Internal Server Error ${error.message}`,
            status.INTERNAL_SERVER_ERROR
        );
    }
}

/**
 * @route   GET /api/repo/id/:id
 * @desc    Retrieve a repository by its ID.
 *
 * This endpoint fetches a single repository using its MongoDB
 * ObjectId. It validates the provided repository ID and returns
 * the repository along with the owner's username and email.
 *
 * @access  Public
 *
 * @param
 * id - The unique MongoDB ObjectId of the repository.
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Repository fetched successfully.",
 *   "data": {
 *     "_id": "...",
 *     "name": "my-first-repo",
 *     "description": "A sample repository.",
 *     "visibility": true,
 *     "owner": {
 *       "_id": "64f0b2b5b4c123456789abcd",
 *       "username": "john_doe",
 *       "email": "john@example.com"
 *     },
 *     "content": [],
 *     "issues": [],
 *     "createdAt": "...",
 *     "updatedAt": "..."
 *   }
 * }
 *
 * @error 400 Bad Request
 * Invalid repository ID.
 *
 * @error 404 Not Found
 * Repository not found.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while fetching the repository.
 */
exports.fetchRepositoriesById = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "Invalid Repo id.", status.BAD_REQUEST);
    }
    try {
        const repo = await Repo.findById(id).populate("owner", "username email").lean();
        if (!repo) {
            return errorResponse(res, "Repo not found.", status.NOT_FOUND);
        }
        return successResponse(res, "Repository fetched successfully.", repo, status.OK);
    } catch (error) {
        return errorResponse(
            res,
            `Internal Server Error ${error.message}`,
            status.INTERNAL_SERVER_ERROR
        )
    }
}

/**
 * @route   GET /api/repo/name/:name
 * @desc    Retrieve repositories by name.
 *
 * This endpoint searches for repositories using the provided name.
 * The repository name is normalized by trimming whitespace,
 * converting it to lowercase, and replacing spaces with hyphens
 * before performing the search. Matching repositories are returned
 * along with their owners' usernames and email addresses.
 *
 * @access  Public
 *
 * @param
 * name - The name of the repository to search for.
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Repositories fetched successfully.",
 *   "data": [
 *     {
 *       "_id": "...",
 *       "name": "my-first-repo",
 *       "description": "A sample repository.",
 *       "visibility": true,
 *       "owner": {
 *         "_id": "64f0b2b5b4c123456789abcd",
 *         "username": "john_doe",
 *         "email": "john@example.com"
 *       },
 *       "content": [],
 *       "issues": [],
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     }
 *   ]
 * }
 *
 * @error 400 Bad Request
 * Repository name is missing or invalid.
 *
 * @error 404 Not Found
 * No repositories found with the specified name.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while fetching repositories.
 */
exports.fetchRepositoriesByName = async (req, res) => {
    const { name } = req.params;
    try {
        if (!name || !name.trim()) {
            return errorResponse(res, "Valid name is required.", status.BAD_REQUEST);
        }

        const repoName = slugify(name);

        const repo = await Repo.findOne({ name: repoName }).populate("owner", "username email").lean();

        if (!repo) {
            return errorResponse(res, "Repository not found.", status.NOT_FOUND);
        }

        return successResponse(res, "Repo fetched successfully.", repo, status.OK);

    } catch (error) {
        return errorResponse(res, `Internal Server Error ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

// TODO: no need of userID in params 
/**
 * @route   GET /api/repo/:userID
 * @desc    Retrieve all repositories owned by the authenticated user.
 *
 * This endpoint fetches all repositories that belong to the currently
 * authenticated user. The user's identity is obtained from the
 * authentication middleware (`req.user`).
 *
 * @access  Private
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Repositories fetched successfully.",
 *   "data": [
 *     {
 *       "_id": "...",
 *       "name": "my-first-repo",
 *       "description": "A sample repository.",
 *       "visibility": true,
 *       "owner": "64f0b2b5b4c123456789abcd",
 *       "content": [],
 *       "issues": [],
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     }
 *   ]
 * }
 *
 * @error 404 Not Found
 * No repositories found for the authenticated user.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while fetching the repositories.
 */
exports.fetchRepositoriesForCurrentUser = async (req, res) => {
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader) {
            return errorResponse(res, "No token provided.", status.UNAUTHORIZED);
        }
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, ENV.JWT_SECRETE);
        const userID = decoded.id;

        const repositories = await Repo.find({ owner: userID }).lean();

        if (repositories.length === 0) {
            return errorResponse(res, "No repository found.", status.OK);
        }

        return successResponse(res, "Repository fetched successfully.", repositories, status.OK);

    } catch (error) {
        return errorResponse(res, `Internal Server Error ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @route   PUT /api/repo/update/:id
 * @desc    Update an existing repository.
 *
 * This endpoint updates the specified repository. Only the fields
 * provided in the request body are modified. If a new repository
 * name is supplied, it is normalized using slugification and checked
 * to ensure it does not already exist for the same owner.
 *
 * @access  Private
 *
 * @param
 * id - The unique MongoDB ObjectId of the repository.
 *
 * @body
 * {
 *   "name": "Updated Repository",        // Optional
 *   "description": "Updated description",// Optional
 *   "content": [],                       // Optional
 *   "visibility": false                  // Optional (true = public, false = private)
 * }
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Repository updated successfully.",
 *   "data": {
 *     "_id": "...",
 *     "name": "updated-repository",
 *     "description": "Updated description",
 *     "content": [],
 *     "visibility": false,
 *     "owner": "64f0b2b5b4c123456789abcd",
 *     "createdAt": "...",
 *     "updatedAt": "..."
 *   }
 * }
 *
 * @error 400 Bad Request
 * Invalid repository ID.
 *
 * @error 404 Not Found
 * Repository not found.
 *
 * @error 409 Conflict
 * A repository with the same name already exists for the owner.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while updating the repository.
 */
exports.updateRepository = async (req, res) => {
    const { id } = req.params;
    const { name, description, content, visibility } = req.body;

    try {
        // Validate repository ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(
                res,
                "Invalid repository ID.",
                status.BAD_REQUEST
            );
        }

        // Check if repository exists
        const repository = await Repo.findById(id);

        if (!repository) {
            return errorResponse(
                res,
                "Repository not found.",
                status.NOT_FOUND
            );
        }

        const updateData = {};

        // Update name only if provided
        if (name && name.trim()) {
            const repoName = slugify(name);

            // Check duplicate name for the same owner
            const existingRepo = await Repo.findOne({
                owner: repository.owner,
                name: repoName,
                _id: { $ne: id }
            });

            if (existingRepo) {
                return errorResponse(
                    res,
                    "Repository already exists.",
                    status.CONFLICT
                );
            }

            updateData.name = repoName;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (content !== undefined) {
            updateData.content = content;
        }

        if (visibility !== undefined) {
            updateData.visibility = visibility;
        }

        const updatedRepository = await Repo.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        return successResponse(
            res,
            "Repository updated successfully.",
            updatedRepository,
            status.OK
        );

    } catch (error) {
        return errorResponse(
            res,
            `Internal Server Error ${error.message}`,
            status.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @route   PATCH /api/repo/toggle-visibility/:id
 * @desc    Toggle the visibility of a repository.
 *
 * This endpoint toggles the visibility of the specified repository.
 * If the repository is currently public (`true`), it will be changed
 * to private (`false`). If it is private (`false`), it will be changed
 * to public (`true`).
 *
 * @access  Private
 *
 * @param
 * id - The unique MongoDB ObjectId of the repository.
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Visibility toggled successfully.",
 *   "data": {
 *     "_id": "...",
 *     "name": "my-first-repo",
 *     "description": "A sample repository.",
 *     "visibility": false,
 *     "owner": "64f0b2b5b4c123456789abcd",
 *     "content": [],
 *     "issues": [],
 *     "createdAt": "...",
 *     "updatedAt": "..."
 *   }
 * }
 *
 * @error 400 Bad Request
 * Invalid repository ID.
 *
 * @error 404 Not Found
 * Repository not found.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while updating the repository visibility.
 */
exports.toggleVisibilityById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, `Invalid Repository id`, status.BAD_REQUEST);
        }



        const repository = await Repo.findById(id);
        if (!repository) {
            return errorResponse(
                res,
                "Repository not found.",
                status.NOT_FOUND
            );
        }

        repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();

        return successResponse(res, "Visibilty is toggled.", updatedRepository, status.OK);

    } catch (error) {
        return errorResponse(res, `Internal Server Error ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }

}

/**
 * @route   DELETE /api/repo/delete/:id
 * @desc    Delete a repository by its ID.
 *
 * This endpoint permanently removes the specified repository from
 * the database after validating the provided repository ID.
 *
 * @access  Private
 *
 * @param
 * id - The unique MongoDB ObjectId of the repository.
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Repository deleted successfully.",
 *   "data": {
 *     "_id": "...",
 *     "name": "my-first-repo",
 *     "description": "A sample repository.",
 *     "visibility": true,
 *     "owner": "64f0b2b5b4c123456789abcd",
 *     "content": [],
 *     "issues": [],
 *     "createdAt": "...",
 *     "updatedAt": "..."
 *   }
 * }
 *
 * @error 400 Bad Request
 * Invalid repository ID.
 *
 * @error 404 Not Found
 * Repository not found.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while deleting the repository.
 */
exports.deleteRepositoryById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, "Invalid repository ID.", status.BAD_REQUEST);
        }

        const deletedRepository = await Repo.findByIdAndDelete(id);

        if (!deletedRepository) {
            return errorResponse(res, "Repository not Found.", status.NOT_FOUND);
        }

        return successResponse(res, "Repository deleted successfully.", deletedRepository, status.OK);

    } catch (error) {
        return errorResponse(res, `External Server Error ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}