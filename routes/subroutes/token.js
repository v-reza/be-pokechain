const {
    getAllTokens,
  } = require("../../controllers/TokenController");
  
  const router = require("express").Router();
  
  router.get("/", getAllTokens);
  
  module.exports = router;
  