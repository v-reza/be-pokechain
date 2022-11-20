const {
  createTransaction,
  buyItemsByIdWithBalance,
  buyItemsByidWithToken,
  notificationMidtrans,
  getNotificationMidtrans,
} = require("../../controllers/TransactionController");
const { verifyToken } = require("../../helper/verify");

const router = require("express").Router();
//midtrans payment
router.post("/create/snap", verifyToken, createTransaction);
router.post("/midtrans/notification", notificationMidtrans);
router.post(
  "/midtrans/status/notification",
  verifyToken,
  getNotificationMidtrans
);

//another payment
router.post(
  "/buy/items/:id/with/ballance",
  verifyToken,
  buyItemsByIdWithBalance
);
router.post("/buy/items/:id/with/token", verifyToken, buyItemsByidWithToken);
module.exports = router;
