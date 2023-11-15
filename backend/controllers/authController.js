const User = require("../models/User")
const validation = require("../utils/validations")
const bcrypt = require("bcrypt")

const authController = {
    register: async (req, res, next) => {
        const { name, email, password } = req.body

        const answerValidateName = validation.validateName(name)
        const isValidEmail = validation.validateName(email)
        const answerValidatePassword = validation.validatePassword(password)

        let message = {
            name: answerValidateName.message,
            isValidEmail: isValidEmail ? "Valid" : "Invalid email",
            password: answerValidatePassword,
        };

        if (!answerValidateName.valid || !isValidEmail || !answerValidatePassword.valid) {
            return res.status(400).json({
                message: message
            })
        }

        try {
            const hashPassword = await bcrypt.hash(password, 12)

            const user = await User.create({
                name,
                email,
                password: hashPassword,
            })

            req.session.userId = user.id

            return res.status(200).json({
                message: "User successfully created"
            })

        } catch (error) {
            res.status(400).json({
                message: "User not successful created",
                error: error.message
            })
        }
    },
    login: async (req, res, next) => {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email or Password not present",
            })
        }

        try {
            const user = await User.findOne({ email })
            if (!user) {
                res.status(400).json({
                    message: "Login not successful",
                    error: "User not found",
                })
            } else {
                const result = await bcrypt.compare(password, user.password);
                if (!result) res.status(400).json({ message: "Login not successful", })
                else {
                    req.session.userId = user.id
                    res.status(200).json({
                        message: "User successfull",
                        user,
                    })
                }
            }
        } catch (error) {
            res.status(400).json({
                message: "An error occured",
                error: error.message,
            })
        }
    },
    logout: async (req, res, next) => {
        if (req.session.userId) {
            req.session.destroy();
            if (req.session == null) {
                res.clearCookie('connect.sid'); // Очищення куки сесії
                res.status(200).json({ message: 'Logged out successfully' });
            } else {
                res.status(500).json({ message: 'Logout failed' });
            }
        } else {
            res.status(401).json({ message: 'Not logged in, unable to log out' });
        }
    }
}

module.exports = authController