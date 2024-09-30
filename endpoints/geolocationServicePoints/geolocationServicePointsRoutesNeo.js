const router = require("express").Router({ mergeParams: true });
const { createGeolocationServicePointSms } = require("./geolocationServicePointsController.js");

router.route("/").post(createGeolocationServicePointSms);

module.exports = router;
