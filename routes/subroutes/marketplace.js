const { recentSales, overallStats, recentListings } = require("../../controllers/MarketplaceController");

const router = require("express").Router();

router.get("/recent-sales", recentSales);
router.get("/overall-stats", overallStats);
router.get("/recent-listings", recentListings)


module.exports = router;
