const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/router.js");

const server = express();
const sessionConfig = {
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
        secure: process.env.SECURE_COOKIE || false, //sends cookie only HTTPS, true in production
        httpOnly: true, // true means JavaScript cannot access cookie (ALWAYS TRUE)
    },
    resave: false,
    saveUninitialized: process.env.USER_ALLOW_COOKIES || true,
    name: 'monster',
    secret: process.env.COOKIE_SECRET || "keepitsecret,keepitsafe!",
};


//create a session and send a cookie back, (cookie stores session id)

server.use(session(sessionConfig)); //turns on sessions for API
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up"});
});

module.exports = server;