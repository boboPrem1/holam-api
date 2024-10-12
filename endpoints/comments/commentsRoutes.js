const router = require("express").Router({ mergeParams: true });
const {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  AddCommentToAVideo,
  RemoveCommentFromAVideo,
} = require("./commentsController");

router.route("/").get(getAllComments).post(createComment);

router
  .route("/:id")
  .get(getCommentById)
  .put(updateComment)
  .delete(deleteComment);

router.route("/actions/add_comment/:id").post(AddCommentToAVideo);
router.route("/actions/remove_comment/:id").delete(RemoveCommentFromAVideo);

module.exports = router;
