const ActivityCategory = require("./activityCategoriesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all activityCategories types
// @Route: /api/v1/activityCategories
// @Access: Public
exports.getAllActivityCategories = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  // const userIn = await req.userIn();
  // queryObj.user = userIn._id;
  try {
    const activityCategories = await ActivityCategory.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(activityCategories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get activityCategory type by id
// @Route: /api/v1/activityCategories/:id
// @Access: Public
exports.getActivityCategoryById = async (req, res) => {
  try {
    // get activityCategory type by id
    const userIn = await req.userIn();

    const activityCategorySearch = await ActivityCategory.find({
      _id: {
        $eq: req.params.id,
      },
    });
    const activityCategory = activityCategorySearch[0];
    if (!activityCategory)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(activityCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new activityCategory type
// @Route: /api/v1/activityCategory
// @Access: Private
exports.createActivityCategory = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  // const userIn = await req.userIn();
  // CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    // create new activityCategory type
    const activityCategory = await ActivityCategory.create(CustomBody);
    res.status(201).json(activityCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update activityCategory type by id
// @Route: /api/v1/activityCategories/:id
// @Access: Private
exports.updateActivityCategory = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const activityCategorySearch = await ActivityCategory.find({
      _id: {
        $eq: req.params.id,
      },
    });
    const activityCategory = activityCategorySearch[0];
    if (!activityCategory) {
      return res.status(404).json({ message: "activityCategory not found !" });
    }

    const updated = await ActivityCategory.findByIdAndUpdate(
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

// @Delete activityCategory type by id
// @Route: /api/v1/activityCategories/:id
// @Access: Private
exports.deleteActivityCategory = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    const activityCategorySearch = await ActivityCategory.find({
      _id: {
        $eq: req.params.id,
      },
    });
    const activityCategory = activityCategorySearch[0];
    if (!activityCategory)
      return res.status(404).json({ message: `activityCategory not found !` });
    // await ActivityCategory.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "activityCategory deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
