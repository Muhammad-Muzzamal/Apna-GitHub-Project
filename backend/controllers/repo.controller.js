exports.createRepository = (req, res) => {
    return res.send("Repository Created");
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