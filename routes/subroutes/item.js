const {
    getAllItems,
  } = require("../../controllers/ItemController");
  
  const router = require("express").Router();
  
  router.get("/", getAllItems);
  
  module.exports = router;
  