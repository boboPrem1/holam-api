const UserRole = require("./userRoleModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all UserRoles
// @route GET /api/v1/UserRoles
// @access Public

exports.getAllUserRoles = async (req, res) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
  try {
    const userRoles = await UserRole.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(userRoles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get UserRole by id
// @route GET /api/v1/UserRoles/:id
// @access Public

exports.getUserRoleById = async (req, res) => {
  try {
    // get UserRole by id
    const userRoles = await UserRole.findById(req.params.id);
    if (!UserRole)
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    res.status(200).json(userRoles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create UserRole
// @route POST /api/v1/UserRoles
// @access Public

exports.createUserRole = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    const userRole = await UserRole.create(CustomBody);
    res.status(201).json(userRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Update UserRole
// @route PUT /api/v1/UserRoles/:id
// @access Public

exports.updateUserRole = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const userRoleSearch = await UserRole.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const userRole = userRoleSearch[0];
    if (!UserRole) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }
    const updated = await UserRole.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete UserRole
// @route DELETE /api/v1/UserRoles/:id
// @access Public

exports.deleteUserRole = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const userRoleSearch = await UserRole.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const userRole = userRoleSearch[0];
    if (!userRole) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }
    await UserRole.findByIdAndDelete(req.params.id);
    return res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
