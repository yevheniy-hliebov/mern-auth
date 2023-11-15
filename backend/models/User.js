const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    }
})

const User = Mongoose.model("user", UserSchema)

module.exports = User