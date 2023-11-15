const express = require("express")
const session = require("express-session")
const { SERVER_PORT } = require("./config/env")
const connectDB = require("./config/database")
const sessionOptions = require("./config/auth")

const app = express()

connectDB()

app.use(session(sessionOptions))

app.use(express.json()) // lets get json from req.body

app.use("/api/auth", require("./routes/authRoutes"))

app.listen(SERVER_PORT, () => console.log(`Server Connected to port ${SERVER_PORT}`))

process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1))
})