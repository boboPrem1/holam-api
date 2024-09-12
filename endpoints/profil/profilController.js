// const CustomUtils = require("../../utils/index.js");
// const User = require("../users/userModel.js");
// const bcrypt = require("bcryptjs");

// // @Get me
// // @route GET /api/v1/users/me
// // @access Private
// exports.getMe = async (req, res) => {
//   try {
//     const user = await User.find({ _id: req.user._id }).sort({ createdAt: -1 });
//     if (!user) return res.status(404).json({ message: `User not found !` });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Post me
// // @route PUT /api/v1/users/me
// // @access Private
// exports.updateMe = async (req, res) => {
//   try {
//     const userUpdated = await User.findByIdAndUpdate(req.user._id, req.body, {
//       new: true,
//     });
//     if (!userUpdated)
//       return res.status(404).json({ message: `User not found !` });
//     res.status(200).json(userUpdated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
 
// exports.getUniqueMe = async (req, res) => { 
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: `User not found !` });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const CustomUtils = require("../../utils/index.js");
const User = require("../users/userModel.js");
const bcrypt = require("bcryptjs");


const hasAccess = (userIn, roles = []) => {
  return roles.includes(userIn.role.slug);
};
// @Get me
// @route GET /api/v1/users/me
// @access Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).sort({ createdAt: -1 });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const id = userIn._id;

    // Limiter les droits de mise à jour selon les rôles
    if (!(userIn && id)) {
      return res.status(403).json({ message: CustomUtils.consts.UNAUTHORIZED });
    }

    const userUpdated = await User.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!userUpdated) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(userUpdated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get user by ID
// @route GET /api/v1/users/:id
// @access Private
exports.getUniqueMe = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};
