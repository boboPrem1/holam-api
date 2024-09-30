// const UserRole = require("./userRoleModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all UserRoles
// // @route GET /api/v1/UserRoles
// // @access Public

// exports.getAllUserRoles = async (req, res) => {
//   let { limit, page, sort, fields, _from } = req.query;
//   const queryObj = CustomUtils.advancedQuery(req.query);
//   const userIn = await req.userIn();
//   if (
//     !userIn.role.slug == "super-administrateur" ||
//     !userIn.role.slug == "admin"
//   ) {
//     queryObj.user = userIn._id;
//   }
//   try {
//     const userRoles = await UserRole.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(userRoles);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get UserRole by id
// // @route GET /api/v1/UserRoles/:id
// // @access Public

// exports.getUserRoleById = async (req, res) => {
//   try {
//     // get UserRole by id
//     const userIn = await req.userIn();
//     let userRoleSearch = await UserRole.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       userRoleSearch = await UserRole.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const userRole = userRoleSearch[0];
//     if (!userRole) {
//       return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
//     }
//     res.status(200).json(userRole);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create UserRole
// // @route POST /api/v1/UserRoles
// // @access Public

// exports.createUserRole = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     const userRole = await UserRole.create(CustomBody);
//     res.status(201).json(userRole);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Update UserRole
// // @route PUT /api/v1/UserRoles/:id
// // @access Public

// exports.updateUserRole = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let userRoleSearch = await UserRole.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       userRoleSearch = await UserRole.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const userRole = userRoleSearch[0];
//     if (!userRole) {
//       return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
//     }
//     const updated = await UserRole.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete UserRole
// // @route DELETE /api/v1/UserRoles/:id
// // @access Public

// exports.deleteUserRole = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let userRoleSearch = await UserRole.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       userRoleSearch = await UserRole.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const userRole = userRoleSearch[0];
//     if (!userRole) {
//       return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
//     }
//     await UserRole.findByIdAndDelete(req.params.id);
//     return res.status(200).json({});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const UserRole = require("./userRoleModel.js");
const CustomUtils = require("../../utils/index.js");

// Helper function to check if user is admin or super-admin
const isAdminOrSuperAdmin = (user) =>
  user.role.slug === "super-administrateur" || user.role.slug === "admin";

// @Get all UserRoles
// @route GET /api/v1/UserRoles
// @access Public

exports.getAllUserRoles = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort = { createdAt: -1 },
      fields,
    } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

    // Limit query for non-admin users
    if (!isAdminOrSuperAdmin(userIn)) {
      queryObj.user = userIn._id;
    }

    const userRoles = await UserRole.find(queryObj)
      .limit(Number(limit))
      .skip(skip)
      .sort(sort)
      .select(fields);

    res.status(200).json(userRoles);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @Get UserRole by id
// @route GET /api/v1/UserRoles/:id
// @access Public

exports.getUserRoleById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    // Restrict non-admins to view only their own roles
    if (!isAdminOrSuperAdmin(userIn)) {
      query.user = userIn._id;
    }

    const userRole = await UserRole.findOne(query);
    if (!userRole) {
      return res
        .status(404)
        .json({ success: false, message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(userRole);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @Create UserRole
// @route POST /api/v1/UserRoles
// @access Public

exports.createUserRole = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const slug = CustomUtils.slugify(req.body.name);

    const userRole = new UserRole({
      ...req.body,
      slug,
      user: userIn._id,
    });

    await userRole.save();
    res.status(201).json(userRole);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @Update UserRole
// @route PUT /api/v1/UserRoles/:id
// @access Public

exports.updateUserRole = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    // Restrict non-admins to update only their own roles
    if (!isAdminOrSuperAdmin(userIn)) {
      query.user = userIn._id;
    }

    const userRole = await UserRole.findOne(query);
    if (!userRole) {
      return res
        .status(404)
        .json({ success: false, message: CustomUtils.consts.NOT_FOUND });
    }

    const updatedUserRole = await UserRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedUserRole);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @Delete UserRole
// @route DELETE /api/v1/UserRoles/:id
// @access Public

exports.deleteUserRole = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    // Restrict non-admins to delete only their own roles
    if (!isAdminOrSuperAdmin(userIn)) {
      query.user = userIn._id;
    }

    const userRole = await UserRole.findOne(query);
    if (!userRole) {
      return res
        .status(404)
        .json({ success: false, message: CustomUtils.consts.NOT_FOUND });
    }

    await UserRole.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "UserRole deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
