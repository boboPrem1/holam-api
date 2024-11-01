const router = require("express").Router({ mergeParams: true });
const {
  getAllCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
} = require("./casesController");

router.route("/").get(getAllCases).post(createCase);

router.route("/:id").get(getCaseById).put(updateCase).delete(deleteCase);

module.exports = router;
