const router = require("express").Router();
const { userGetController } =  require("../../controllers/usersController");

router.get("/", userGetController);

module.exports = router;