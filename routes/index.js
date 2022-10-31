/* Import Module */
const express = require("express");
const app = express();
const usersRouter = require("./subroutes/users");
const pokemonsRouter = require("./subroutes/pokemons");

app.use("/users", usersRouter);
app.use("/pokemons", pokemonsRouter);

module.exports = app;
