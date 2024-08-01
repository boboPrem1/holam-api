const router = require("express").Router({ mergeParams: true });
const {
  getAllGeolocationServiceTransactions,
  getGeolocationServiceTransactionById,
  createGeolocationServiceTransaction,
  updateGeolocationServiceTransaction,
  deleteGeolocationServiceTransaction,
} = require("./geolocationServiceTransactionsController.js");

router.route("/").get(getAllGeolocationServiceTransactions).post(createGeolocationServiceTransaction);

router.route("/:id").get(getGeolocationServiceTransactionById).put(updateGeolocationServiceTransaction).delete(deleteGeolocationServiceTransaction);

module.exports = router;
