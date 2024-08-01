const Permission = require("./permissionsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all opportunity types
// @Route: /api/v1/opportunity_targets
// @Access: Public
exports.getAllPermissions = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const Permissions = await Permission.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(Permissions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get opportunity type by id
// @Route: /api/v1/opportunity_targets/:id
// @Access: Public
exports.getPermissionById = async (req, res) => {
  try {
    // get opportunity type by id
    const permission = await Permission.findById(req.params.id);
    if (!permission)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new opportunity type
// @Route: /api/v1/opportunity_targets
// @Access: Private
exports.createPermission = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new opportunity type
    const permission = await Permission.create(CustomBody);
    res.status(201).json(permission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update opportunity type by id
// @Route: /api/v1/opportunity_targets/:id
// @Access: Private
exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: "permission not found !" });
    }

    const updated = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete opportunity type by id
// @Route: /api/v1/opportunity_targets/:id
// @Access: Private
exports.deletePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission)
      return res.status(404).json({ message: `permission not found !` });
    await Permission.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "permission deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
