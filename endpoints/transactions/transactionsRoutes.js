const router = require("express").Router({ mergeParams: true });
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  paymentCallback,
} = require("./transactionsController");

router.route("/").get(getAllTransactions).post(createTransaction);

router.route("/callback").get(paymentCallback);

router.route("/:id").get(getTransactionById).put(updateTransaction).delete(deleteTransaction);

module.exports = router;
