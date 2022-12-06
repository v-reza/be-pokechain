const { getAllItems, getItemByIncrementId, insertMyItems } = require("../../controllers/ItemController");

const router = require("express").Router();

router.get("/", getAllItems);
router.get("/:id", getItemByIncrementId)
router.get("/dummy/insertMyItem",insertMyItems)

module.exports = router;
