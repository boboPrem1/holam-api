const router = require("express").Router({ mergeParams: true });
const {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} = require("./commentsController");

router.route("/").get(getAllComments).post(createComment);

router.route("/:id").get(getCommentById).put(updateComment).delete(deleteComment);

module.exports = router;
