const router = require("express").Router({ mergeParams: true });
const {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} = require("./activitiesController");

router.route("/").get(getAllActivities).post(createActivity);

router
  .route("/:id")
  .get(getActivityById)
  .put(updateActivity)
  .delete(deleteActivity);

module.exports = router;
