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