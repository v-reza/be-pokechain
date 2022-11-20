const router = require("express").Router();
const {
  register,
  login,
  logout,
  refreshToken,
  users,
} = require("../../controllers/AuthController");
const { verifyToken } = require("../../helper/verify");

router.post("/register", register);
router.post("/login", login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

router.get("/users", verifyToken, users);

module.exports = router;
