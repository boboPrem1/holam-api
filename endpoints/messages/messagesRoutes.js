const router = require("express").Router({ mergeParams: true });
const {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  updateMessageReadBy,
  getAllChatMessages,
} = require("./messagesController");

router.route("/").get(getAllMessages).post(createMessage);

router.route("/:id").get(getMessageById).put(updateMessage).delete(deleteMessage);

router.route("/actions/update_read_by").put(updateMessageReadBy);
router.route("/actions/chat_messages/:id").get(getAllChatMessages);

module.exports = router;
