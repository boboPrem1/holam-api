const router = require("express").Router({ mergeParams: true });
const {
  getAllActivityCategories,
  getActivityCategoryById,
  createActivityCategory,
  updateActivityCategory,
  deleteActivityCategory,
} = require("./activityCategoriesController");

router.route("/").get(getAllActivityCategories).post(createActivityCategory);

router
  .route("/:id")
  .get(getActivityCategoryById)
  .put(updateActivityCategory)
  .delete(deleteActivityCategory);

module.exports = router;
