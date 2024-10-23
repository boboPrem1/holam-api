const CustomUtils = require("../../utils");
const Course = require("../courses/coursesModel");
const Video = require("./videosModel");

const router = require("express").Router({ mergeParams: true });

router.route("/").get(async (req, res, next) => {
  let { limit, page, sort, fields, _from } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {

    const courses = await Course.find({}, "videos").exec();

    const videosInCourses = courses.reduce((acc, course) => {
      return acc.concat(course.videos);
    }, []);

    const videosNotInCourses = await Video.find({
      _id: { $nin: videosInCourses },
    })
      .limit(limit)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);

    // const videos = await Video.find(queryObj)
    //   .limit(limit)
    //   .sort({
    //     createdAt: -1,
    //     ...sort,
    //   })
    //   .select(fields);
    res.status(200).json(videosNotInCourses);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.route("/courses").get(async (req, res, next) => {
  let { limit, page, sort, fields, _from } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const courses = await Course.find(queryObj)
      .limit(limit)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(courses);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
