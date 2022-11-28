const {
    getAllBundles,
  } = require("../../controllers/BundleController");
  
  const router = require("express").Router();
  
  router.get("/", getAllBundles);
  
  module.exports = router;
  