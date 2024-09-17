const ActivitySubCategory = require("./activitySubCategoriesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all activitySubCategories types
// @Route: /api/v1/activitySubCategories
// @Access: Public
exports.getAllActivitySubCategories = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort = "-createdAt", fields } = req.query;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

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
    const query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const activitySubCategory = await ActivitySubCategory.findOne(query);

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
  try {
    const userIn = await req.userIn();
    const CustomBody = {
      ...req.body,
      user: userIn._id,
      slug: CustomUtils.slugify(req.body.name),
    };
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
    const query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const activitySubCategory = await ActivitySubCategory.findOneAndUpdate(
      query,
      req.body,
      {
        new: true,
      }
    );

    if (!activitySubCategory) {
      return res
        .status(404)
        .json({ message: "Activity sub category not found !" });
    }

    return res.status(200).json(activitySubCategory);
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
    const query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const activitySubCategory = await ActivitySubCategory.findOneAndDelete(
      query
    );

    if (!activitySubCategory)
      return res
        .status(404)
        .json({ message: `Activity sub category not found !` });
    res
      .status(200)
      .json({ message: "Activity sub category deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
