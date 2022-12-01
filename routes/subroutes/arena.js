const {
  postArena,
  getArenaTier,
  claimRewardToBackpack,
  updateLoginReward,
} = require("../../controllers/ArenaController");
const { verifyToken } = require("../../helper/verify");

const router = require("express").Router();

router.get("/tier", verifyToken, getArenaTier);
router.post("/", postArena);
router.post("/claim-reward", verifyToken, claimRewardToBackpack);
router.put("/update-login-reward", verifyToken, updateLoginReward);

module.exports = router;
