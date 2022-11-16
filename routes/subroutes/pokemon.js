const {
  getAllPokemons,
  getPokemonByName,
} = require("../../controllers/PokemonController");

const router = require("express").Router();

router.get("/", getAllPokemons);
router.get("/evolution/:name", getPokemonByName);

module.exports = router;
