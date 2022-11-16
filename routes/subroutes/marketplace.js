const {
  recentSales,
  overallStats,
  recentListings,
  topSales,
  dataDummy,
} = require("../../controllers/MarketplaceController");

const router = require("express").Router();

router.get("/recent-sales", recentSales);
router.get("/overall-stats", overallStats);
router.get("/recent-listings", recentListings);
router.get("/top-sales", topSales);
router.get("/dummy", dataDummy);

module.exports = router;
