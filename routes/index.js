/* Import Module */
const express = require("express");
const app = express();
const authRouter = require("./subroutes/auth");
const userRouter = require("./subroutes/user");
const pokemonRouter = require("./subroutes/pokemon");
const marketplaceRouter = require("./subroutes/marketplace");
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/pokemon", pokemonRouter);
app.use("/marketplace", marketplaceRouter)

module.exports = app;
