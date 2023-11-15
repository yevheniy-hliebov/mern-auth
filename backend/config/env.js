require('dotenv').config();
exports.SERVER_PORT = process.env.SERVER_PORT;
exports.MONGODB_LINK = process.env.MONGODB_LINK;
exports.SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;