const router = require("express").Router();
const {
  register,
  login,
  logout,
  refreshToken,
} = require("../../controllers/authsController");

router.post("/register", register);
router.post("/login", login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

module.exports = router;
