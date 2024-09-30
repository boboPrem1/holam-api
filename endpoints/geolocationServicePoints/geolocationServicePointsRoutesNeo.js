const router = require("express").Router({ mergeParams: true });
const {} = require("./geolocationServicePointsController.js");

router.route("/").post(createGeolocationServicePointSms);

module.exports = router;
