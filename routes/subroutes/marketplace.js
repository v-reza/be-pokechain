const {
  recentSales,
  overallStats,
  recentListings,
  topSales,
  dataDummy,
  dataDumyPokemon,
  dataDumyItems
} = require("../../controllers/MarketplaceController");

const router = require("express").Router();

router.get("/recent-sales", recentSales);
router.get("/overall-stats", overallStats);
router.get("/recent-listings", recentListings);
router.get("/top-sales", topSales);
router.get("/dummy", dataDummy);
router.get("/insertmypoke",dataDumyPokemon)
router.get("/insertdataitem",dataDumyItems)

module.exports = router;
