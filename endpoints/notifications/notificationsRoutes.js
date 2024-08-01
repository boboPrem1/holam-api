const router = require("express").Router({ mergeParams: true });
const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} = require("./notificationsController");

router.route("/").get(getAllNotifications).post(createNotification);

router.route("/:id").get(getNotificationById).put(updateNotification).delete(deleteNotification);

module.exports = router;
