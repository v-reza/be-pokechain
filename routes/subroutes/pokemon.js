const {
  pokemonsGetController,
} = require("../../controllers/PokemonController");

const router = require("express").Router();

router.get("/", pokemonsGetController);

module.exports = router;
