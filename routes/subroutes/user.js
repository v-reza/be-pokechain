const router = require("express").Router();
const { userGetController } =  require("../../controllers/UserController");

router.get("/", userGetController);

module.exports = router;