const router = require("express").Router({ mergeParams: true });
const {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  AddLikeToAVideo,
  RemoveLikeFromAVideo,
  ViewAVideo,
} = require("./videosController.js");

router.route("/").get(getAllVideos).post(createVideo);

router.route("/:id").get(getVideoById).put(updateVideo).delete(deleteVideo);

router.route("/actions/like_dislike/:id").post(AddLikeToAVideo);
router.route("/actions/view/:id").post(ViewAVideo);
router.route("/actions/dislike/:id").post(RemoveLikeFromAVideo);

module.exports = router;
