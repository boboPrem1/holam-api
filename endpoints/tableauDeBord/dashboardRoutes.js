const router = require("express").Router({ mergeParams: true });
const { getAllTotaux, connected } = require("./dashboardController");
const { protect, restrictTo } = require("../auth/authController.js");

router.route("/").get(getAllTotaux);
router.route("/connected").get(connected);

module.exports = router;
