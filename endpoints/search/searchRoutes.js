const router = require("express").Router({ mergeParams: true });
const {
  getAllFound
} = require("./searchController.js");
const { protect, restrictTo } = require("../auth/authController.js");

router.route("/").get(getAllFound);

module.exports = router;
