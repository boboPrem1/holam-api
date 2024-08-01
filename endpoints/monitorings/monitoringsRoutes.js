const router = require("express").Router({ mergeParams: true });
const {
  getAllMonitorings,
  getMonitoringById,
  createMonitoring,
  updateMonitoring,
  deleteMonitoring,
} = require("./monitoringsController");

router.route("/").get(getAllMonitorings).post(createMonitoring);

router.route("/:id").get(getMonitoringById).put(updateMonitoring).delete(deleteMonitoring);

module.exports = router;
