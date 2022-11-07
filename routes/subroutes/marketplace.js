const { recentSales } = require("../../controllers/MarketplaceController");

const router = require("express").Router();

router.get("/recent-sales", recentSales);

module.exports = router;
