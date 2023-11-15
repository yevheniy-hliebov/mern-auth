# МERN Auth Deployment Guide

**This documentation describes the deployment and various authentication capabilities within the MERN stack _(MongoDB, Express.js, React.js, Node.js)_.**

It includes instructions for programming registration, login, logout, session configuration, password recovery, changing personal information, and displaying pages for different user types: guests, authenticated users, and administrators.
   
# Backend
## 1. Deployment of the backend structure
### Let's create folders and files according to the following file structure.

``` backend folder structure
/backend
    |- /config
    |    |- env.js              // Env variables
    |    |- database.js         // Database setup
    |    |- auth.js             // Configure authentication and authorization
    |
    |- /controllers
    |    |- userController.js   // Controllers for working with users
    |    |- authController.js   // Controllers for authentication and authorization
    |
    |- /models
    |    |- User.js             // User model
    |
    |- /routes
    |    |- userRoutes.js       // Routing for user operations
    |    |- authRoutes.js       // Routing for authentication and authorization
    |
    |- /middlewares
    |    |- authMiddleware.js   // Authentication middleware
    |
    |- /utils
    |    |- validations.js      // Functions for validate register data
    |
    |- server.js                // Main server file
    |- package.json             // Package and script configuration file
    |- .env                     // File for storing confidential data
```

### Installation of all necessary packages.
```
npm init -y
```
The command `npm init -y` initializes a new Node.js project by creating a package.json file with default settings, without prompting for user input.
```
npm i express nodemon dotenv mongoose bcrypt express-session connect-mongo
```
This command installs necessary packages:  
- `express`: for building web applications with Node.js
- `nodemon`: for automatic server restarts during development
- `dotenv`: for loading environment variables from a .env file into process.env
- `mongoose`: an elegant MongoDB object modeling tool
- `bcrypt`: for hashing passwords
- `express-session`: for managing session data in Express
- `connect-mongo`: for storing session data in MongoDB
  
**Change package.json**
```json
"scripts":{
    "start": "node server.js",
    "dev": "nodemon server.js"
},
```

## 2. Configure the Express.js server and connect to MongoDB
Before we begin, let's record the following necessary parameters in the .env file and connect them in the configuration.

```js .env
// .env
SERVER_PORT = 3000
CLIENT_PORT = 5173

// Options for connecting to mongodb
MONGODB_LINK = "mongodb+srv://<username>:<password>@<cluster-domain>/?dbName=<database-name>&retryWrites=true&w=majority"

// Session secret
SESSION_SECRET_KEY = "your_secret_key"
```

![mongodblink.png](/readme-img/mongodblink.png)

```js
// config/env.js
require('dotenv').config();
exports.SERVER_PORT = process.env.SERVER_PORT;
exports.MONGODB_LINK = process.env.MONGODB_LINK;
exports.SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;
```

### Connect to MongoDB
```js
// config/database.js
const Mongoose = require("mongoose");
const { MONGODB_LINK } = require("./env")
const connectDB = async () => {
    await Mongoose.connect(MONGODB_LINK)
    console.log("MongoDB Connected")
}
module.exports = connectDB
```
The block of code `config/database.js` establishes a connection to MongoDB using `Mongoose`. It defines a function `connectDB` that connects to the MongoDB instance using the provided `MONGODB_LINK` from the environment variables.

### Configure the Express.js server
```js
const express = require("express")
const { SERVER_PORT } = require("./config/env")
const connectDB = require("./config/database")
const app = express()

connectDB()

app.listen(SERVER_PORT, () => console.log(`Server Connected to port ${SERVER_PORT}`))

process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1))
})
```
The block of code `server.js` configures the Express.js server. It imports necessary modules, such as `express`, `SERVER_PORT` from the environment variables, and `connectDB` from the database configuration. The server is started on the specified port, and `connectDB` is called to establish the MongoDB connection. Additionally, it sets up an error handling mechanism for unhandled promise rejections using `process.on("unhandledRejection")`.

## 3. Add Express Session
```js
// config/auth.js
const MongoStore = require('connect-mongo');
const { MONGODB_LINK, SESSION_SECRET_KEY } = require("./env")

const sessionOptions = {
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGODB_LINK }),
    cookie: {
        maxAge: 1000 * 60 // 1 minute
    }
}

module.exports = sessionOptions;
```

```js
// update code server.js
const express = require("express")
const session = require("express-session")
const { SERVER_PORT } = require("./config/env")
const connectDB = require("./config/database")
const sessionOptions = require("./config/auth")

const app = express()

connectDB()

app.use(session(sessionOptions))

app.listen(SERVER_PORT, () => console.log(`Server Connected to port ${SERVER_PORT}`))

process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1))
})
```

After successful authorization, you can configure the session data, for example, store the user.id in the session for further identification of the user: 
`req.session.userId = user.id`

## 4. Create User Schema
```js
// models/User.js
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
```

## 5. Register, Login and Logout API
```js
// controllers/authController.js
const User = require("../models/User")
const bcrypt = require("bcrypt")

const authController = {
    register: async (req, res, next) => { ... },
    login: async (req, res, next) => { ... },
    logout: async (req, res, next) => { ... }
}

module.exports = authController
```

### Register function
```js
// controllers/authController.js
register: async (req, res, next) => {
    const { name, email, password } = req.body

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password less than 6 characters"
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
```

### Login function
```js
// controllers/authController.js
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
}
```

### Logout
```js
// controllers/authController.js
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

```
### Routes
```js
// routes/authRoutes.js
const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

router.route("/register").post(authController.register)
router.route("/login").post(authController.login) 
router.route("/logout").post(authController.logout) 

module.exports = router
```

### Add router to `server.js`
```js
// update server.js
...
app.use(session(sessionOptions))

app.use(express.json()) // lets get json from req.body
app.use("/api/auth", require("./routes/authRoutes"))

app.listen(SERVER_PORT, () => console.log(`Server Connected to port ${SERVER_PORT}`))
...
```