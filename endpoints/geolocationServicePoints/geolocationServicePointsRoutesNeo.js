const router = require("express").Router({ mergeParams: true });
const { createGeolocationServicePointSms, activateAgent } = require("./geolocationServicePointsController.js");

router.route("/verify_point").post(createGeolocationServicePointSms);
router.route("/activate_agent").post(activateAgent);

module.exports = router;
