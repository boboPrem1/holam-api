const router = require("express").Router({ mergeParams: true });
const {
  getAllActivityCategories,
  getActivityCategoryById,
  createActivityCategory,
  updateActivityCategory,
  deleteActivityCategory,
  getActivitySubCategoriesByCategoryId,
} = require("./activityCategoriesController");

router.route("/").get(getAllActivityCategories).post(createActivityCategory);

router
  .route("/:id")
  .get(getActivityCategoryById)
  .put(updateActivityCategory)
  .delete(deleteActivityCategory);

router.route("/sub_categories/:id").get(getActivitySubCategoriesByCategoryId)

module.exports = router;
