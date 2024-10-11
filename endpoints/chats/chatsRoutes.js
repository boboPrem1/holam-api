const router = require("express").Router({ mergeParams: true });
const {
  getAllChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat,
  addMemberLearnerToCourseChat,
  removeMemberLearnerToCourseChat,
} = require("./chatsController.js");

router.route("/").get(getAllChats).post(createChat);
router
  .route("/:id")
  .get(getChatById)
  .put(updateChat)
  .delete(deleteChat)
  .post(addMemberLearnerToCourseChat);
router.route("/actions/add_member/:id").post(addMemberLearnerToCourseChat);
router
  .route("/actions/remove_member/:id")
  .post(removeMemberLearnerToCourseChat);

module.exports = router;
