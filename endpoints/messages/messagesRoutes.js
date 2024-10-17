const router = require("express").Router({ mergeParams: true });
const {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  updateMessageReadBy,
} = require("./messagesController");

router.route("/").get(getAllMessages).post(createMessage);

router.route("/:id").get(getMessageById).put(updateMessage).delete(deleteMessage);

router.route("/actions/update_read_by").put(updateMessageReadBy);

module.exports = router;
