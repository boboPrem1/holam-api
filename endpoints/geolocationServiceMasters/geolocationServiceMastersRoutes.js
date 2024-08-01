const router = require("express").Router({ mergeParams: true });
const {
  getAllGeolocationServiceMasters,
  getGeolocationServiceMasterById,
  createGeolocationServiceMaster,
  updateGeolocationServiceMasterById,
  deleteGeolocationServiceMasterById,
} = require("./geolocationServiceMastersController");

router.route("/").get(getAllGeolocationServiceMasters).post(createGeolocationServiceMaster);

router
  .route("/:id")
  .get(getGeolocationServiceMasterById)
  .put(updateGeolocationServiceMasterById)
  .delete(deleteGeolocationServiceMasterById);

module.exports = router;
