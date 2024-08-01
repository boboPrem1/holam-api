const router = require("express").Router({ mergeParams: true });
const {
  getAllGeolocationServices,
  getGeolocationServiceById,
  createGeolocationService,
  updateGeolocationServiceById,
  deleteGeolocationServiceById,
} = require("./geolocationServicesController");

router.route("/").get(getAllGeolocationServices).post(createGeolocationService);

router
  .route("/:id")
  .get(getGeolocationServiceById)
  .put(updateGeolocationServiceById)
  .delete(deleteGeolocationServiceById);

module.exports = router;
