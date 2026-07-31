const getAllUsers = (req, res) => {
    return res.send("All users fetched.");
}

const signup = (req, res) => {
    return res.send("Signing Up!");
}

const login = (req, res) => {
    return res.send("Logging in!");
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