const router = require("express").Router({ mergeParams: true });
const {
  getAllGeolocationServicePoints,
  getGeolocationServicePointById,
  createGeolocationServicePoint,
  updateGeolocationServicePoint,
  deleteGeolocationServicePoint,
} = require("./geolocationServicePointsController.js");

router
  .route("/")
  .get(getAllGeolocationServicePoints)
  .post(createGeolocationServicePoint);

router
  .route("/:id")
  .get(getGeolocationServicePointById)
  .put(updateGeolocationServicePoint)
  .delete(deleteGeolocationServicePoint);

module.exports = router;
