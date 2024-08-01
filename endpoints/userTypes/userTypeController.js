const UserType = require("./userTypeModel");
const CustomUtils = require("../../utils/index.js");

// @Get all event types
// @route Get /api/v1/userTypes
// @access Public
exports.getAllUserTypes = async (req, res) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const userTypes = await UserType.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(userTypes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get event type by id
// @route Get /api/v1/userTypes/:id
// @access Public
exports.getUserTypeById = async (req, res) => {
  try {
    const userType = await UserType.findById(req.params.id);
    if (!userType)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    res.status(200).json(userType);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Create new event type
// @route Post /api/v1/userTypes
// @access Public
exports.createUserType = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    const newuserType = await UserType.create(CustomBody);
    res.status(201).json(newuserType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update event type by id
// @route Patch /api/v1/userTypes/:id
// @access Public
exports.updateUserTypeById = async (req, res) => {
  try {
    const userType = await UserType.findById(req.params.id);
    if (!userType)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });

    const updated = await UserType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete event type by id
// @route Delete /api/v1/userTypes/:id
// @access Public
exports.deleteUserTypeById = async (req, res) => {
  try {
    const userType = await UserType.findById(req.params.id);
    if (!userType)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    await UserType.findByIdAndDelete(req.params.id);
    return res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
