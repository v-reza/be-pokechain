const router = require("express").Router();
const {
  getBackpackPokemon,
  getBackpackItems,
  sellBackpackItems,
  verifyPassword,
  convertBalanceToToken,
  getActivityToken,
  convertTokenToBalance,
  sellBackpackToken,
} = require("../../controllers/BackpackController");
const { verifyToken } = require("../../helper/verify");

router.get("/pokemon", verifyToken, getBackpackPokemon);
router.get("/items", verifyToken, getBackpackItems);
router.post("/sell/items", verifyToken, sellBackpackItems);
router.post("/sell/token", verifyToken, sellBackpackToken);
router.post("/verify/password", verifyToken, verifyPassword)
router.put("/convert/to/token", verifyToken, convertBalanceToToken)
router.put("/convert/to/balance", verifyToken, convertTokenToBalance)
router.get("/activity/token", verifyToken, getActivityToken)

module.exports = router;
