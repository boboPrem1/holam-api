const router = require("express").Router({ mergeParams: true });
const {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
} = require("./filesController");

router.route("/").get(getAllFiles).post(createFile);

router
  .route("/:id")
  .get(getFileById)
  .put(updateFile)
  .delete(deleteFile);

module.exports = router;
