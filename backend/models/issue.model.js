const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    issueStatus: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repo",
        required: true
    }
});

const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue;