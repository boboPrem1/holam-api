const router = require("express").Router({ mergeParams: true });
const { updateMe, getMe, getUniqueMe } = require("./profilController");
const { protect, restrictTo } = require("../auth/authController.js");

router.route("/").get(getMe);
router.route("/update").put(updateMe);

module.exports = router;