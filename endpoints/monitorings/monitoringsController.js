const Monitoring = require("./monitoringsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all monitorings
// @Route: /api/v1/monitorings
// @Access: Public
exports.getAllMonitorings = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  if (
    !userIn.role.slug === "super-administrateur" ||
    !userIn.role.slug === "admin"
  ) {
    queryObj.user = userIn._id;
  }
  try {
    const monitorings = await Monitoring.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(monitorings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get monitoring by id
// @Route: /api/v1/monitorings/:id
// @Access: Public
exports.getMonitoringById = async (req, res) => {
  try {
    // get monitoring by id
    const userIn = await req.userIn();

    let monitoringSearch = await Monitoring.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      monitoringSearch = await Monitoring.find({
        _id: {
          $eq: req.params.id,
        },
      });
    }
    const monitoring = monitoringSearch[0];
    if (!monitoring)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(monitoring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new monitoring
// @Route: /api/v1/monitorings
// @Access: Private
exports.createMonitoring = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    // create new monitoring
    const monitoring = await Monitoring.create(CustomBody);
    res.status(201).json(monitoring);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update monitoring by id
// @Route: /api/v1/monitorings/:id
// @Access: Private
exports.updateMonitoring = async (req, res) => {
  try {
    const userIn = await req.userIn();

    let monitoringSearch = await Monitoring.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      monitoringSearch = await Monitoring.find({
        _id: {
          $eq: req.params.id,
        },
      });
    }
    const monitoring = monitoringSearch[0];
    if (!monitoring) {
      return res.status(404).json({ message: "monitoring not found !" });
    }

    const updated = await Monitoring.findByIdAndUpdate(
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

// @Delete monitoring by id
// @Route: /api/v1/monitorings/:id
// @Access: Private
exports.deleteMonitoring = async (req, res) => {
  try {
    const userIn = await req.userIn();

    let monitoringSearch = await Monitoring.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      monitoringSearch = await Monitoring.find({
        _id: {
          $eq: req.params.id,
        },
      });
    }
    const monitoring = monitoringSearch[0];
    if (!monitoring)
      return res.status(404).json({ message: `monitoring not found !` });
    await Monitoring.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "monitoring deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
