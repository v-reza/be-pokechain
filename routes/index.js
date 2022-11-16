/* Import Module */
const express = require("express");
const app = express();
const authRouter = require("./subroutes/auth");
const userRouter = require("./subroutes/user");
const pokemonRouter = require("./subroutes/pokemon");
const itemRouter = require("./subroutes/item");
const bundleRouter = require("./subroutes/bundle");
const tokenRouter = require("./subroutes/token");
const marketplaceRouter = require("./subroutes/marketplace");
const backpackRouter = require("./subroutes/backpack");

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/pokemon", pokemonRouter);
app.use("/marketplace", marketplaceRouter)
app.use("/item", itemRouter)
app.use("/bundle", bundleRouter)
app.use("/token",tokenRouter)
app.use("/backpack", backpackRouter);

module.exports = app;
