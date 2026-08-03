const mongoose = require("mongoose");
const { ENV } = require("./env.config.js");

module.exports = async function connectDB() {
    mongoose.connect(ENV.DB_URI)
        .then(() => {
            console.log("MongoDB is connected!");
        })
        .catch((error) => {
            console.log("Error while connecting MongoDB", error);
        })
}
