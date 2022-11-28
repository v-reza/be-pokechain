const {
  getAllPokemons,
  getPokemonByName,
  getPokemonByIncrementId,
  insertMarketPokemon
} = require("../../controllers/PokemonController");

const router = require("express").Router();

router.get("/", getAllPokemons);
router.get("/evolution/:name", getPokemonByName);
router.get("/:id", getPokemonByIncrementId);
router.get("/insertMarketPokemon/d", insertMarketPokemon);

module.exports = router;
