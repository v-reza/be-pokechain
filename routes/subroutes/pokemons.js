const {
  pokemonsGetController,
} = require("../../controllers/pokemonsController");

const router = require("express").Router();

router.get("/", pokemonsGetController);

module.exports = router;
