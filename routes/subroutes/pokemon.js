const {
  getAllPokemons,
} = require("../../controllers/PokemonController");

const router = require("express").Router();

router.get("/", getAllPokemons);

module.exports = router;
