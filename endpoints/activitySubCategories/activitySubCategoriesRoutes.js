const router = require("express").Router({ mergeParams: true });
const {
  getAllActivitySubCategories,
  getActivitySubCategoryById,
  createActivitySubCategory,
  updateActivitySubCategory,
  deleteActivitySubCategory,
} = require("./activitySubCategoriesController");

router.route("/").get(getAllActivitySubCategories).post(createActivitySubCategory);

router
  .route("/:id")
  .get(getActivitySubCategoryById)
  .put(updateActivitySubCategory)
  .delete(deleteActivitySubCategory);

module.exports = router;
