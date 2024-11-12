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
  resetPassword,
  sendOtp,
} = require("./authController.js");

router.route("/signup").post(signup);
router.route("/signin-with-tel").post(signinWithTel);
router.route("/signin-with-email").post(signinWithEmail);
router.route("/signin-with-tel-otp").post(signinWithTelOtp);
router.route("/set-password").post(setPassword);
router.route("/sign").post(sign);
router.route("/verify-otp").post(verifyOtp);
router.route("/send-otp").post(sendOtp);
router.route("/reset-password").post(resetPassword);

module.exports = router;
