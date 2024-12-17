const Activity = require("./activitiesModel.js");
const CustomUtils = require("../../utils/index.js");
const Case = require("../cases/casesModel.js");

// @Get all activities
// @Route: /api/v1/activities
// @Access: Public
exports.getAllActivities = async (req, res) => {
  try {
    let {
      limit = 10,
      page = 1,
      sort = "-createdAt",
      fields,
      _from,
    } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();


    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.user = userIn._id;
    }

    let activities = null;

    activities = await Activity.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .select(fields ? fields.split(",").join(" ") : "");

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get activity by id
// @Route: /api/v1/activities/:id
// @Access: Public
exports.getActivityById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const activity = await Activity.findOne(query);

    if (!activity) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new activity
// @Route: /api/v1/activities
// @Access: Private
exports.createActivity = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const CustomBody = {
      ...req.body,
      user: userIn._id,
      slug: CustomUtils.slugify(req.body.description),
      location: {
        type: "Point",
        coordinates: req.body.location.split(" ").map(Number),
      },
    };

    const holam_case = await Case.create({
      report: `${CustomBody.description} created`,
      user: userIn._id,
    });

    CustomBody.case = holam_case._id;

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
    const query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const activity = await Activity.findOneAndUpdate(query, req.body, {
      new: true,
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found!" });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete activity by id
// @Route: /api/v1/activities/:id
// @Access: Private
exports.deleteActivity = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const activity = await Activity.findOneAndDelete(query);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found!" });
    }

    res.status(200).json({ message: "Activity deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
