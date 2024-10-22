const router = require("express").Router({ mergeParams: true });
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  paymentCallback,
  checkTransaction,
  createBalanceTransaction,
  testCreateBalanceTransaction,
  testCreateTransaction,
} = require("./transactionsController");

router.route("/").get(getAllTransactions).post(createTransaction);

// router.route("/callback").get(paymentCallback);

router
  .route("/:id")
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

router.route("/actions/balance_transactions").post(createBalanceTransaction);
router.route("/actions/test/transactions").post(testCreateTransaction);

module.exports = router;
