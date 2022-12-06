const {
    getAllBundles,
    getBundleByIncrementId,
    getBundleItemById
  } = require("../../controllers/BundleController");
  
  const router = require("express").Router();
  
  router.get("/", getAllBundles);
  router.get("/incrementId/:incrementId", getBundleByIncrementId);
  router.get("/item/:id", getBundleItemById);

  module.exports = router;
  