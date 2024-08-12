const router = require("express").Router({ mergeParams: true });
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
  viewUser,
} = require("./usersController");
const { protect, restrictTo } = require("../auth/authController.js");

router.route("/").get(getAllUsers).post(createUser);

router.route("/profile/me").get(getMe);

router.route("/view/user").post(viewUser);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
