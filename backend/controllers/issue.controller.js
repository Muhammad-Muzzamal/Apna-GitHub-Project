
const { status } = require("http-status");
const mongoose = require("mongoose")
const { errorResponse, successResponse } = require("../helper/apiResponse.js");
const Issue = require("../models/issue.model.js");
const Repo = require("../models/repo.model.js");

/**
 * @route   POST /api/issue/create
 * @desc    Create a new issue for a repository.
 *
 * This endpoint creates a new issue after validating the required
 * fields. It ensures that the title, description, and repository
 * are provided, verifies that the repository ID is valid, and
 * confirms that the repository exists before creating the issue.
 *
 * @access  Private
 *
 * @body
 * {
 *   "title": "Bug in authentication",
 *   "description": "Users are unable to log in with valid credentials.",
 *   "issueStatus": false,                    // Optional (e.g., false = open, true = closed)
 *   "repository": "64f0b2b5b4c123456789abcd"
 * }
 *
 * @success 201 Created
 * {
 *   "success": true,
 *   "message": "Issue created successfully.",
 *   "data": {
 *     "_id": "...",
 *     "title": "Bug in authentication",
 *     "description": "Users are unable to log in with valid credentials.",
 *     "issueStatus": false,
 *     "repository": "64f0b2b5b4c123456789abcd",
 *     "createdAt": "...",
 *     "updatedAt": "..."
 *   }
 * }
 *
 * @error 400 Bad Request
 * Title, description, and repository are required.
 *
 * @error 400 Bad Request
 * Invalid repository ID.
 *
 * @error 404 Not Found
 * Repository not found.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while creating the issue.
 */
exports.createIssue = async (req, res) => {
    const { title, description, issueStatus, repository } = req.body;

    try {

        if (!title || !description || !repository) {
            return errorResponse(
                res,
                "Title, description and repository are required.",
                status.BAD_REQUEST
            );
        }

        // Validate repository ObjectId
        if (!mongoose.Types.ObjectId.isValid(repository)) {
            return errorResponse(res, "Invalid repository ID.", status.BAD_REQUEST);
        }

        const repositoryDoc = await Repo.findById(repository);

        // Repository not found
        if (!repositoryDoc) {
            return errorResponse(res, "Repository not found.", status.NOT_FOUND);
        }

        const issue = await Issue.create({ title, description, issueStatus, repository });

        return successResponse(res, "Issue created successfully.", issue, status.CREATED);

    } catch (error) {
        return errorResponse(res, `Internal Server Error. ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @route   GET /api/issue/all
 * @desc    Retrieve all issues.
 *
 * This endpoint fetches all issues from the database along with
 * the associated repository's name and owner information. If no
 * issues exist, an empty array is returned.
 *
 * @access  Private
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Issues fetched successfully.",
 *   "data": [
 *     {
 *       "_id": "...",
 *       "title": "Bug in authentication",
 *       "description": "Users are unable to log in with valid credentials.",
 *       "issueStatus": false,
 *       "repository": {
 *         "_id": "64f0b2b5b4c123456789abcd",
 *         "name": "my-first-repo",
 *         "owner": "64f0b2b5b4c123456789abce"
 *       },
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     }
 *   ]
 * }
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "No issues found.",
 *   "data": []
 * }
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while fetching issues.
 */
exports.getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find({}).populate("repository", "name owner").lean();

        if (issues.length === 0) {
            return successResponse(res, "No issues found.", [], status.OK);
        }

        return successResponse(res, "Issues fetched successfully.", issues, status.OK);


    } catch (error) {
        return errorResponse(res, `Internal Server Error. ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @route   GET /api/issue/:id
 * @desc    Retrieve an issue by its ID.
 *
 * This endpoint fetches a single issue using its MongoDB ObjectId.
 * It validates the provided issue ID and returns the issue along
 * with its associated repository information.
 *
 * @access  Private
 *
 * @param
 * id - The unique MongoDB ObjectId of the issue.
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Issue found successfully.",
 *   "data": {
 *     "_id": "...",
 *     "title": "Bug in authentication",
 *     "description": "Users are unable to log in with valid credentials.",
 *     "issueStatus": false,
 *     "repository": {
 *       "_id": "64f0b2b5b4c123456789abcd",
 *       "name": "my-first-repo",
 *       "owner": "64f0b2b5b4c123456789abce"
 *     },
 *     "createdAt": "...",
 *     "updatedAt": "..."
 *   }
 * }
 *
 * @error 400 Bad Request
 * Invalid issue ID.
 *
 * @error 404 Not Found
 * Issue not found.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while fetching the issue.
 */
exports.getIssueById = async (req, res) => {
    const { id } = req.params;
    try {
        // Validate Issue ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, "Invalid issue ID.", status.BAD_REQUEST);
        }

        const issue = await Issue.findById(id).populate("repository", "name, owner").lean();

        if (!issue) {
            return errorResponse(res, "Issue not found.", status.NOT_FOUND);
        }

        return successResponse(res, "Issue found successfully.", issue, status.OK);

    } catch (error) {
        return errorResponse(res, `Internal Server Error. ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @route   PUT /api/issue/:id
 * @desc    Update an existing issue.
 *
 * This endpoint updates the specified issue. Only the fields
 * provided in the request body are modified. The updated issue
 * is returned after a successful update.
 *
 * @access  Private
 *
 * @param
 * id - The unique MongoDB ObjectId of the issue.
 *
 * @body
 * {
 *   "title": "Updated issue title",              // Optional
 *   "description": "Updated issue description",  // Optional
 *   "issueStatus": true                          // Optional (true = closed, false = open)
 * }
 *
 * @success 200 OK
 * {
 *   "success": true,
 *   "message": "Issue updated successfully.",
 *   "data": {
 *     "_id": "...",
 *     "title": "Updated issue title",
 *     "description": "Updated issue description",
 *     "issueStatus": true,
 *     "repository": "64f0b2b5b4c123456789abcd",
 *     "createdAt": "...",
 *     "updatedAt": "..."
 *   }
 * }
 *
 * @error 400 Bad Request
 * Invalid issue ID.
 *
 * @error 404 Not Found
 * Issue not found.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while updating the issue.
 */
exports.updateIssue = async (req, res) => {
    const { id } = req.params;
    const { title, description, issueStatus } = req.body;
    try {
        // Validate Issue ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, "Invalid issue ID.", status.BAD_REQUEST);
        }

        const updatedIssue = await Issue.findByIdAndUpdate(id, { title, description, issueStatus }, { new: true, runValidators: true }).lean();

        if (!updatedIssue) {
            return errorResponse(res, "Issue not found.", status.NOT_FOUND);
        }

        return successResponse(res, "Issue updated successfully.", updatedIssue, status.OK);
    } catch (error) {
        return errorResponse(res, `Internal Server Error. ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @route   DELETE /api/issue/:id
 * @desc    Delete an issue by its ID.
 *
 * This endpoint permanently removes the specified issue from the
 * database after validating the provided issue ID.
 *
 * @access  Private
 *
 * @param
 * id - The unique MongoDB ObjectId of the issue.
 *
 * @success 204 No Content
 * {
 *   "success": true,
 *   "message": "Issue deleted successfully.",
 *   "data": []
 * }
 *
 * @error 400 Bad Request
 * Invalid issue ID.
 *
 * @error 404 Not Found
 * Issue not found.
 *
 * @error 500 Internal Server Error
 * An unexpected error occurred while deleting the issue.
 */
exports.deleteIssue = async (req, res) => {
    const { id } = req.params;
    try {
        // Validate Issue ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, "Invalid issue ID.", status.BAD_REQUEST);
        }

        const issue = await Issue.findByIdAndDelete(id);

        if (!issue) {
            return errorResponse(res, "Issue not found.", status.NOT_FOUND);
        }

        return res.status(status.NO_CONTENT).send();
    } catch (error) {
        return errorResponse(res, `Internal Server Error. ${error.message}`, status.INTERNAL_SERVER_ERROR);
    }
}
