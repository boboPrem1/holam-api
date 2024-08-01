const router = require("express").Router({ mergeParams: true });

const {
  getAllUserRoles,
  getUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
} = require("./userRoleController.js");

router.route("/").get(getAllUserRoles).post(createUserRole);

router
  .route("/:id")
  .get(getUserRoleById)
  .put(updateUserRole)
  .delete(deleteUserRole);

module.exports = router;
