const ActivitySubCategory = require("./activitySubCategoriesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all activitySubCategories types
// @Route: /api/v1/activitySubCategories
// @Access: Public
exports.getAllActivitySubCategories = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
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
    const userIn = await req.userIn();

    const activitySubCategorySearch = await ActivitySubCategory.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const activitySubCategory = activitySubCategorySearch[0];
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

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
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
    const userIn = await req.userIn();
    const activitySubCategorySearch = await ActivitySubCategory.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const activitySubCategory = activitySubCategorySearch[0];
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
exports.deleteActivitySubCategory = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const activitySubCategorySearch = await ActivitySubCategory.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const activitySubCategory = activitySubCategorySearch[0];
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
