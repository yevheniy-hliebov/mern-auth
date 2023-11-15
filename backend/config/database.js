const Mongoose = require("mongoose");
const { MONGODB_LINK } = require("./env")
const connectDB = async () => {
	await Mongoose.connect(MONGODB_LINK)
	console.log("MongoDB Connected")
}
module.exports = connectDB