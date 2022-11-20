const { getAllItems, getItemByIncrementId } = require("../../controllers/ItemController");

const router = require("express").Router();

router.get("/", getAllItems);
router.get("/:id", getItemByIncrementId)

module.exports = router;
