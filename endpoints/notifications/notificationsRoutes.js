const router = require("express").Router({ mergeParams: true });
const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  sendMulticastNotification,
  sendNotificationToAndroid,
  sendNotificationToIos,
} = require("./notificationsController");

router.route("/").get(getAllNotifications).post(createNotification);

router.route("/:id").get(getNotificationById).put(updateNotification).delete(deleteNotification);

router.route("/actions/send_multicast").post(sendMulticastNotification);
router.route("/actions/send_to_android").post(sendNotificationToAndroid);
router.route("/actions/send_to_ios").post(sendNotificationToIos);

module.exports = router;
