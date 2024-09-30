// const Permission = require("./permissionsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all opportunity types
// // @Route: /api/v1/opportunity_targets
// // @Access: Public
// exports.getAllPermissions = async (req, res, next) => {
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
//     const Permissions = await Permission.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(Permissions);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get opportunity type by id
// // @Route: /api/v1/opportunity_targets/:id
// // @Access: Public
// exports.getPermissionById = async (req, res) => {
//   try {
//     // get opportunity type by id
//     const userIn = await req.userIn();

//     let permissionSearch = await Permission.find({
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
//       permissionSearch = await Permission.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const permission = permissionSearch[0];
//     if (!permission)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(permission);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new opportunity type
// // @Route: /api/v1/opportunity_targets
// // @Access: Private
// exports.createPermission = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new opportunity type
//     const permission = await Permission.create(CustomBody);
//     res.status(201).json(permission);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update opportunity type by id
// // @Route: /api/v1/opportunity_targets/:id
// // @Access: Private
// exports.updatePermission = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let permissionSearch = await Permission.find({
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
//       permissionSearch = await Permission.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const permission = permissionSearch[0];
//     if (!permission) {
//       return res.status(404).json({ message: "permission not found !" });
//     }

//     const updated = await Permission.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete opportunity type by id
// // @Route: /api/v1/opportunity_targets/:id
// // @Access: Private
// exports.deletePermission = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let permissionSearch = await Permission.find({
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
//       permissionSearch = await Permission.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const permission = permissionSearch[0];
//     if (!permission)
//       return res.status(404).json({ message: `permission not found !` });
//     await Permission.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "permission deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Permission = require("./permissionsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all permissions
// @Route: /api/v1/permissions
// @Access: Public
exports.getAllPermissions = async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, fields, _from } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);

    const userIn = await req.userIn();
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.user = userIn._id; // Limiter aux permissions de l'utilisateur courant
    }

    const permissions = await Permission.find(queryObj)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort(sort ? JSON.parse(sort) : { createdAt: -1 })
      .select(fields ? fields.split(",").join(" ") : "");

    res.status(200).json(permissions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get permission by id
// @Route: /api/v1/permissions/:id
// @Access: Public
exports.getPermissionById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id; // Restreindre si l'utilisateur n'est pas admin
    }

    const permission = await Permission.findOne(query);
    if (!permission) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new permission
// @Route: /api/v1/permissions
// @Access: Private
exports.createPermission = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const CustomBody = {
      ...req.body,
      user: userIn._id,
      slug: CustomUtils.slugify(req.body.name),
    };

    const permission = await Permission.create(CustomBody);
    res.status(201).json(permission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update permission by id
// @Route: /api/v1/permissions/:id
// @Access: Private
exports.updatePermission = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id; // Restreindre si l'utilisateur n'est pas admin
    }

    const permission = await Permission.findOneAndUpdate(query, req.body, {
      new: true,
    });
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete permission by id
// @Route: /api/v1/permissions/:id
// @Access: Private
exports.deletePermission = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id; // Restreindre si l'utilisateur n'est pas admin
    }

    const permission = await Permission.findOneAndDelete(query);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
