const { recentSales, overallStats } = require("../../controllers/MarketplaceController");

const router = require("express").Router();

router.get("/recent-sales", recentSales);
router.get("/overall-stats", overallStats);


module.exports = router;
