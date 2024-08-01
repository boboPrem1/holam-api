const router = require("express").Router({ mergeParams: true });
const {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} = require("./permissionsController");

router.route("/").get(getAllPermissions).post(createPermission);

router
  .route("/:id")
  .get(getPermissionById)
  .put(updatePermission)
  .delete(deletePermission);

module.exports = router;
