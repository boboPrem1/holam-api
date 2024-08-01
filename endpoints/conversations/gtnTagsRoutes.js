const router = require("express").Router({ mergeParams: true });
const {
  getAllGtnTags,
  getGtnTagById,
  createGtnTag,
  updateGtnTag,
  deleteGtnTag,
} = require("./gtnTagsController");

router.route("/").get(getAllGtnTags).post(createGtnTag);

router.route("/:id").get(getGtnTagById).put(updateGtnTag).delete(deleteGtnTag);

module.exports = router;
