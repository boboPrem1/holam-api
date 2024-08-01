const ActivitySubCategory = require("./activitySubCategoriesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all activitySubCategories types
// @Route: /api/v1/activitySubCategories
// @Access: Public
exports.getAllActivitySubCategories = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const activitySubCategories = await ActivitySubCategory.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(activitySubCategories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get activitySubCategory type by id
// @Route: /api/v1/activitySubCategories/:id
// @Access: Public
exports.getActivitySubCategoryById = async (req, res) => {
  try {
    // get activitySubCategory type by id
    const activitySubCategory = await ActivitySubCategory.findById(
      req.params.id
    );
    if (!activitySubCategory)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(activitySubCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new activitySubCategory type
// @Route: /api/v1/activitySubCategory
// @Access: Private
exports.createActivitySubCategory = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new activitySubCategory type
    const activitySubCategory = await ActivitySubCategory.create(CustomBody);
    res.status(201).json(activitySubCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update activitySubCategory type by id
// @Route: /api/v1/activitySubCategories/:id
// @Access: Private
exports.updateActivitySubCategory = async (req, res) => {
  try {
    const activitySubCategory = await ActivitySubCategory.findById(
      req.params.id
    );
    if (!activitySubCategory) {
      return res
        .status(404)
        .json({ message: "activitySubCategory not found !" });
    }

    const updated = await ActivitySubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete activitySubCategory type by id
// @Route: /api/v1/activitySubCategories/:id
// @Access: Private
exports.deleteActivitySubCategory = async (req, res, next) => {
  try {
    const activitySubCategory = await ActivitySubCategory.findById(
      req.params.id
    );
    if (!activitySubCategory)
      return res
        .status(404)
        .json({ message: `activitySubCategory not found !` });
    await ActivitySubCategory.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "activitySubCategory deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
