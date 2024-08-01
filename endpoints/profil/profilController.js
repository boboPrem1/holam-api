const CustomUtils = require("../../utils/index.js");
const User = require("../users/userModel.js");
const bcrypt = require("bcryptjs");

// @Get me
// @route GET /api/v1/users/me
// @access Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.find({ _id: req.user._id }).sort({ createdAt: -1 });
    if (!user) return res.status(404).json({ message: `User not found !` });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Post me
// @route PUT /api/v1/users/me
// @access Private
exports.updateMe = async (req, res) => {
  try {
    const userUpdated = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    if (!userUpdated)
      return res.status(404).json({ message: `User not found !` });
    res.status(200).json(userUpdated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
exports.getUniqueMe = async (req, res) => { 
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: `User not found !` });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
