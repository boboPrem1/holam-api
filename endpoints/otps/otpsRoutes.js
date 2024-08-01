const router = require("express").Router({ mergeParams: true });
const {
  getAllOtps,
  getOtpById,
  createOtp,
  updateOtp,
  deleteOtp,
} = require("./otpsController");

router.route("/").get(getAllOtps).post(createOtp);

router
  .route("/:id")
  .get(getOtpById)
  .put(updateOtp)
  .delete(deleteOtp);

module.exports = router;
