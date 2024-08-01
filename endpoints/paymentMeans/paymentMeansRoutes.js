const router = require("express").Router({ mergeParams: true });
const {
  getAllPaymentMeans,
  getPaymentMeanById,
  createPaymentMean,
  updatePaymentMean,
  deletePaymentMean,
} = require("./paymentMeansController.js");

router.route("/").get(getAllPaymentMeans).post(createPaymentMean);

router.route("/:id").get(getPaymentMeanById).put(updatePaymentMean).delete(deletePaymentMean);

module.exports = router;
