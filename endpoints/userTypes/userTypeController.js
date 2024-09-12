// const UserType = require("./userTypeModel");
// const CustomUtils = require("../../utils/index.js");

// // @Get all event types
// // @route Get /api/v1/userTypes
// // @access Public
// exports.getAllUserTypes = async (req, res) => {
//   const { limit, page, sort, fields } = req.query;
//   const queryObj = CustomUtils.advancedQuery(req.query);
//   const userIn = await req.userIn();
//   if (
//     !userIn.role.slug == "super-administrateur" ||
//     !userIn.role.slug == "admin"
//   ) {
//     queryObj.user = userIn._id;
//   }
//   try {
//     const userTypes = await UserType.find(queryObj)
//       .limit(limit * 1)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(userTypes);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get event type by id
// // @route Get /api/v1/userTypes/:id
// // @access Public
// exports.getUserTypeById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     const userTypeSearch = await UserType.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     const userType = userTypeSearch[0];
//     if (!userType)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     res.status(200).json(userType);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Create new event type
// // @route Post /api/v1/userTypes
// // @access Public
// exports.createUserType = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     const newuserType = await UserType.create(CustomBody);
//     res.status(201).json(newuserType);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update event type by id
// // @route Patch /api/v1/userTypes/:id
// // @access Public
// exports.updateUserTypeById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     const userTypeSearch = await UserType.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     const userType = userTypeSearch[0];
//     if (!userType)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });

//     const updated = await UserType.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete event type by id
// // @route Delete /api/v1/userTypes/:id
// // @access Public
// exports.deleteUserTypeById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     const userTypeSearch = await UserType.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     const userType = userTypeSearch[0];
//     if (!userType)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     await UserType.findByIdAndDelete(req.params.id);
//     return res.status(200).json({});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const UserType = require("./userTypeModel");
const CustomUtils = require("../../utils/index.js");

// @Get all user types
// @route GET /api/v1/userTypes
// @access Public
exports.getAllUserTypes = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "-createdAt", fields } = req.query; // Default pagination
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

    // Restreindre la recherche aux utilisateurs non admin
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.user = userIn._id;
    }

    const userTypes = await UserType.find(queryObj)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort(sort)
      .select(fields ? fields.split(",").join(" ") : "");

    res.status(200).json({ success: true, data: userTypes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get user type by id
// @route GET /api/v1/userTypes/:id
// @access Public
exports.getUserTypeById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const userType = await UserType.findOne({
      _id: req.params.id,
      user: userIn._id,
    });

    if (!userType) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    res.status(200).json({ success: true, data: userType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new user type
// @route POST /api/v1/userTypes
// @access Public
exports.createUserType = async (req, res) => {
  try {
    const CustomBody = { ...req.body };
    const userIn = await req.userIn();

    CustomBody.slug = CustomUtils.slugify(CustomBody.name);
    CustomBody.user = userIn._id;

    const newUserType = await UserType.create(CustomBody);

    res.status(201).json({ success: true, data: newUserType });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update user type by id
// @route PATCH /api/v1/userTypes/:id
// @access Public
exports.updateUserTypeById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const userType = await UserType.findOne({
      _id: req.params.id,
      user: userIn._id,
    });

    if (!userType) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    const updatedUserType = await UserType.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true, // Valider les données mises à jour
      }
    );

    res.status(200).json({ success: true, data: updatedUserType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete user type by id
// @route DELETE /api/v1/userTypes/:id
// @access Public
exports.deleteUserTypeById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const userType = await UserType.findOne({
      _id: req.params.id,
      user: userIn._id,
    });

    if (!userType) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    await UserType.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "User type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
