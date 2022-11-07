const router = require("express").Router();
const { userGetController, getById } =  require("../../controllers/UserController");

router.get("/", userGetController);
router.get("/:id", getById)

module.exports = router;