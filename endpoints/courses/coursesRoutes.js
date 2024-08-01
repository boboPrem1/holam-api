const router = require("express").Router({ mergeParams: true });
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("./coursesController");

router.route("/").get(getAllCourses).post(createCourse);

router.route("/:id").get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = router;
