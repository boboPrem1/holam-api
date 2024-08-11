const Activity = require("./activitiesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all activitiess
// @Route: /api/v1/activities
// @Access: Public
exports.getAllActivities = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
  try {
    const activities = await Activity.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(activities);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get activity by id
// @Route: /api/v1/activities/:id
// @Access: Public
exports.getActivityById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    // get activity by id
    const activitySearch = await Activity.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const activity = activitySearch[0];
    if (!activity)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new activity
// @Route: /api/v1/activities
// @Access: Private
exports.createActivity = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.description);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    const initialLocation = CustomBody.location.split(" ");

    const trueLocation = {
      type: "Point",
      coordinates: initialLocation,
    };

    CustomBody.location = trueLocation;
    // create new activity
    const activity = await Activity.create(CustomBody);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update activity by id
// @Route: /api/v1/activities/:id
// @Access: Private
exports.updateActivity = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const activitySearch = await Activity.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const activity = activitySearch[0];
    if (!activity) {
      return res.status(404).json({ message: "activity not found !" });
    }

    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete activity by id
// @Route: /api/v1/activities/:id
// @Access: Private
exports.deleteActivity = async (req, res, next) => {
  try {
    const userIn = await req.userIn();
    const activitySearch = await Activity.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const activity = activitySearch[0];
    if (!activity)
      return res.status(404).json({ message: `activity not found !` });
    await Activity.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "activity deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
