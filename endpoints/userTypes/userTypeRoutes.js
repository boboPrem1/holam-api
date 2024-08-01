const router = require("express").Router({ mergeParams: true });
const {
  getAllUserTypes,
  getUserTypeById,
  createUserType,
  updateUserTypeById,
  deleteUserTypeById,
} = require("./userTypeController");

router.route("/").get(getAllUserTypes).post(createUserType);

router
  .route("/:id")
  .get(getUserTypeById)
  .put(updateUserTypeById)
  .delete(deleteUserTypeById);

module.exports = router;
