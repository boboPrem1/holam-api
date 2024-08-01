const router = require("express").Router({ mergeParams: true });
const {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} = require("./videosController.js");

router.route("/").get(getAllVideos).post(createVideo);

router.route("/:id").get(getVideoById).put(updateVideo).delete(deleteVideo);

module.exports = router;
