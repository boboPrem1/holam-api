const Course = require("./coursesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all course
// @Route: /api/v1/courses
// @Access: Public
exports.getAllCourses = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  if (
    !userIn.role.slug === "super-administrateur" ||
    !userIn.role.slug === "admin"
  ) {
    queryObj.user = userIn._id;
  }
  try {
    const courses = await Course.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(courses);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get course by id
// @Route: /api/v1/courses/:id
// @Access: Public
exports.getCourseById = async (req, res) => {
  try {
    // get course by id
    const userIn = await req.userIn();

    let courseSearch = await Course.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      courseSearch = await Course.find({
        _id: {
          $eq: req.params.id,
        },
      });
    }
    const course = courseSearch[0];
    if (!course)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new course // @Route: /api/v1/courses
// @Access: Private
exports.createCourse = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    // create new course
    const course = await Course.create(CustomBody);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update course by id
// @Route: /api/v1/courses/:id
// @Access: Private
exports.updateCourse = async (req, res) => {
  try {
    const userIn = await req.userIn();

    let courseSearch = await Course.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      courseSearch = await Course.find({
        _id: {
          $eq: req.params.id,
        },
      });
    }
    const course = courseSearch[0];
    if (!course) {
      return res.status(404).json({ message: "course not found !" });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete course by id
// @Route: /api/v1/courses/:id
// @Access: Private
exports.deleteCourse = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    let courseSearch = await Course.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      courseSearch = await Course.find({
        _id: {
          $eq: req.params.id,
        },
      });
    }
    const course = courseSearch[0];
    if (!course) return res.status(404).json({ message: `course not found !` });
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "course deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
