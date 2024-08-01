const router = require("express").Router({ mergeParams: true });
const {
  getAllGeolocationServiceClients,
  getGeolocationServiceClientById,
  createGeolocationServiceClient,
  updateGeolocationServiceClientById,
  deleteGeolocationServiceClientById,
} = require("./geolocationServicesClientsController");

router.route("/").get(getAllGeolocationServiceClients).post(createGeolocationServiceClient);

router
  .route("/:id")
  .get(getGeolocationServiceClientById)
  .put(updateGeolocationServiceClientById)
  .delete(deleteGeolocationServiceClientById);

module.exports = router;
