const router = require("express").Router({ mergeParams: true });
const {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("./messagesController");

router.route("/").get(getAllMessages).post(createMessage);

router.route("/:id").get(getMessageById).put(updateMessage).delete(deleteMessage);

module.exports = router;
