const router = require("express").Router({ mergeParams: true });
const {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} = require("./tagsController");

router.route("/").get(getAllTags).post(createTag);

router.route("/:id").get(getTagById).put(updateTag).delete(deleteTag);

module.exports = router;
