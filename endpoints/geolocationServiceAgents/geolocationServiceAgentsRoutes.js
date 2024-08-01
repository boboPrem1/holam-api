const router = require("express").Router({ mergeParams: true });
const {
  getAllGeolocationServiceAgents,
  getGeolocationServiceAgentById,
  createGeolocationServiceAgent,
  updateGeolocationServiceAgentById,
  deleteGeolocationServiceAgentById,
} = require("./geolocationServiceAgentsController");

router.route("/").get(getAllGeolocationServiceAgents).post(createGeolocationServiceAgent);

router
  .route("/:id")
  .get(getGeolocationServiceAgentById)
  .put(updateGeolocationServiceAgentById)
  .delete(deleteGeolocationServiceAgentById);

module.exports = router;
