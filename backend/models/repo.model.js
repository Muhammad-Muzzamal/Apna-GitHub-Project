const mongoose = require("mongoose");
const { Schema } = mongoose;

const RepoSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
    },
    content: [
        {
            type: String
        }
    ],
    visibility: {
        type: Boolean,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        reqired: true
    },
    issues: [
        {
            type : Schema.Types.ObjectId,
            ref : "Issue"
        }
    ]

});

const Repo = mongoose.model("Repo", RepoSchema);
module.exports = Repo;