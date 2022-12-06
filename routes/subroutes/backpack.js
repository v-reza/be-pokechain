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
  sellBackpackPokemon,
  getBackpackFragment,
  claimRewardCombine,
} = require("../../controllers/BackpackController");
const { verifyToken } = require("../../helper/verify");

router.get("/pokemon", verifyToken, getBackpackPokemon);
router.get("/items", verifyToken, getBackpackItems);
router.post("/sell/items", verifyToken, sellBackpackItems);
router.post("/sell/pokemon", verifyToken, sellBackpackPokemon);
router.post("/sell/token", verifyToken, sellBackpackToken);
router.post("/verify/password", verifyToken, verifyPassword);
router.put("/convert/to/token", verifyToken, convertBalanceToToken);
router.put("/convert/to/balance", verifyToken, convertTokenToBalance);
router.get("/activity/token", verifyToken, getActivityToken);
router.get("/my/fragments", verifyToken, getBackpackFragment);
router.post("/combine", verifyToken, claimRewardCombine);

module.exports = router;
