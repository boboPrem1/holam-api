const router = require("express").Router({ mergeParams: true });
const {
  getAllChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat,
} = require("./chatsController.js");

router.route("/").get(getAllChats).post(createChat);

router.route("/:id").get(getChatById).put(updateChat).delete(deleteChat);

module.exports = router;
