/* Import Module */
const express = require("express");
const app = express();
const usersRouter = require("./subroutes/users");

app.use("/users", usersRouter);

module.exports = app;
