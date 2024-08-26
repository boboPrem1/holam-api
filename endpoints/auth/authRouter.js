const router = require("express").Router({ mergeParams: true });
const {
  signup,
  signin,
  sign,
  verifyOtp,
  signinWithTel,
  setPassword,
  signinWithTelOtp,
  signinWithEmail,
} = require("./authController.js");

router.route("/signup").post(signup);
router.route("/signin-with-tel").post(signinWithTel);
router.route("/signin-with-email").post(signinWithEmail);
router.route("/signin-with-tel-otp").post(signinWithTelOtp);
router.route("/set-password").post(setPassword);
router.route("/sign").post(sign);
router.route("/verify-otp").post(verifyOtp);

module.exports = router;
