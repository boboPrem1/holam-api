// const CustomUtils = require("../../utils/index.js");
// const User = require("./userModel");
// const UserRole = require("../userRoles/userRoleModel");
// const bcrypt = require("bcryptjs");

// // @Get me
// // @route GET /api/v1/users/me
// // @access Private
// exports.getMe = async (req, res) => {
//   try {
//     // console.log(req.user);
//     const user = await req.userIn();
//     if (!user) return res.status(404).json({ message: `User not found !` });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Post me
// // @route GET /api/v1/users/view-user
// // @access Private
// exports.viewUser = async (req, res) => {
//   const CustomBody = req.body;
//   try {
//     const userIn = await req.userIn();
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       req.viewUser = async () => {
//         return await User.findById(CustomBody.user);
//       };

//       if (!CustomBody.user)
//         return res
//           .status(400)
//           .json({ message: CustomUtils.consts.MISSING_DATA });

//       res.status(200).json({ message: "Data charged successfully" });
//     } else {
//       res.status(400).json({ message: CustomUtils.consts.UNAUTHORIZED });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Get all users
// // @route GET /api/v1/users
// // @access Public
// exports.getAllUsers = async (req, res) => {
//   let { limit, page, sort, fields, _from } = req.query;
//   const queryObj = CustomUtils.advancedQuery(req.query);

//   const userIn = await req.userIn();
//   if (
//     !userIn.role.slug == "super-administrateur" ||
//     !userIn.role.slug == "admin"
//   ) {
//     queryObj.user = userIn._id;
//   }
//   // const test = await req.viewUser();
//   // console.log(test);
//   //
//   // const userIn = await req.userIn();
//   // console.log(userIn);
//   try {
//     // if (req.user.role.slug !== "admin") queryObj.created_by = req.user._id;
//     // console.log(queryObj);
//     // const roleSlug = queryObj.role;
//     // if (roleSlug) {
//     //   const role = await UserRole.find({ slug: roleSlug });
//     //   if (role.length) queryObj.role = role[0]._id;
//     // }
//     // console.log(roleId);
//     const users = await User.find(queryObj)
//       .limit(limit)
//       .sort({ createdAt: -1, ...sort })
//       .select(fields);
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get user by id
// // @route GET /api/v1/users/:id
// // @access Public
// exports.getUserById = async (req, res) => {
//   // get user by id
//   try {
//     const userIn = await req.userIn();
//     let userSearch = await User.find({
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
//       userSearch = await User.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const user = userSearch[0];
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: `User with id: ${req.params.id} not found !` });
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create user
// // @route POST /api/v1/users
// // @access Public
// exports.createUser = async (req, res) => {
//   try {
//     const bodyWR = { ...req.body };

//     const userIn = await req.userIn();
//     bodyWR.user = userIn._id;
//     bodyWR.username = CustomUtils.generateUsername();
//     // console.log(bodyWR);
//     const userRole = await UserRole.find({ slug: "user" });
//     const adminRole = await UserRole.find({ slug: bodyWR.role });
//     // if (role.length) bodyWR.role = role[0]._id;
//     switch (req.user.role.slug) {
//       case "super-administrateur":
//         if (adminRole.length) bodyWR.role = adminRole[0]._id;
//         break;
//       case "admin":
//         if (userRole.length) bodyWR.role = userRole[0]._id;
//         break;
//       case "user":
//         if (userRole.length) bodyWR.role = userRole[0]._id;
//         break;
//       case "contact":
//         return res
//           .status(400)
//           .json({ message: CustomUtils.consts.UNAUTHORIZED });
//       default:
//         return res
//           .status(400)
//           .json({ message: CustomUtils.consts.UNAUTHORIZED });
//     }

//     if (bodyWR.email) {
//       const existingEmail = await User.find({
//         email: bodyWR.email,
//       });
//       if (existingEmail.length)
//         return res
//           .status(400)
//           .json({ message: CustomUtils.consts.EXISTING_ACCOUNT });
//     }
//     const slug = CustomUtils.slugify(bodyWR.title);
//     bodyWR.slug = slug;
//     bodyWR.created_by = req.user._id;
//     bodyWR.complete_name = `${bodyWR.lastname ? bodyWR.lastname + " " : ""}${
//       bodyWR.firstname ? bodyWR.firstname : ""
//     }`;
//     const newUser = await User.create(bodyWR);
//     await User.findByIdAndUpdate(newUser._id, { password: bodyWR.password });

//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Update user
// // @route PUT /api/v1/users/:id
// // @access Public
// exports.updateUser = async (req, res) => {
//   try {
//     const userIn = await req.userIn();
//     let userSearch = await User.find({
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
//       userSearch = await User.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const user = userSearch[0];
//     if (!user) return res.status(404).json({ message: `User not found !` });
//     // console.log(user._id != req.user._id, user._id + "", req.user._id + "");
//     if (user._id + "" != req.user._id + "" && req.user.role.slug != "admin")
//       return res.status(400).json({ message: CustomUtils.consts.UNAUTHORIZED });
//     const userUpdated = await User.findByIdAndUpdate(req.params.id, req.body, {
//       runValidators: true,
//       new: true,
//     });
//     res.status(200).json(userUpdated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
//   // }
// };

// // @Delete user
// // @route DELETE /api/v1/users/:id
// // @access Public
// exports.deleteUser = async (req, res) => {
//   try {
//     const userIn = await req.userIn();
//     let userSearch = await User.find({
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
//       userSearch = await User.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const user = userSearch[0];
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: `User with id: ${req.params.id} not found !` });
//     if (user._id !== req.user._id && req.user.role.slug !== "admin")
//       return res.status(400).json({ message: CustomUtils.consts.UNAUTHORIZED });
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "User deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const CustomUtils = require("../../utils/index.js");
const User = require("./userModel");
const UserRole = require("../userRoles/userRoleModel");
const bcrypt = require("bcryptjs");

// Vérifie si l'utilisateur a accès à une fonctionnalité spécifique
const hasAccess = (userIn, roles = []) => {
  return roles.includes(userIn.role.slug);
};

// @Get me - Récupère les informations de l'utilisateur connecté
// @route GET /api/v1/users/me
// @access Private
exports.getMe = async (req, res) => {
  try {
    const user = await req.userIn();
    if (!user) return res.status(404).json({ message: `User not found!` });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @View user - Visualise un utilisateur selon son ID
// @route GET /api/v1/users/view-user
// @access Private
exports.viewUser = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const { user: userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
    }

    if (hasAccess(userIn, ["super-administrateur", "admin"])) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      return res.status(200).json(user);
    } else {
      return res.status(403).json({ message: CustomUtils.consts.UNAUTHORIZED });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get all users - Récupère tous les utilisateurs avec pagination et filtres
// @route GET /api/v1/users
// @access Public
exports.getAllUsers = async (req, res) => {
  let { limit = 10, page = 1, sort, fields, _from } = req.query;
  limit = parseInt(limit, 10);
  let skip = null;
  if (_from) limit = null;
  const queryObj = CustomUtils.advancedQuery(req.query);

  try {
    const userIn = await req.userIn();

    // Limiter la portée de la recherche si l'utilisateur n'est pas admin ou super-admin
    if (!hasAccess(userIn, ["super-administrateur", "admin"])) {
      queryObj.user = userIn._id;
    }

    const users = await User.find(queryObj)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1, ...sort })
      .select(fields);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get user by id - Récupère un utilisateur par ID
// @route GET /api/v1/users/:id
// @access Public
exports.getUserById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const { id } = req.params;

    const query = hasAccess(userIn, ["super-administrateur", "admin"])
      ? { _id: id }
      : { _id: id, user: userIn._id };

    const user = await User.findOne(query);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id: ${id} not found!` });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create user - Crée un nouvel utilisateur
// @route POST /api/v1/users
// @access Public
exports.createUser = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const bodyWR = { ...req.body, user: userIn._id };
    bodyWR.username = CustomUtils.generateUsername();

    let role;
    switch (userIn.role.slug) {
      case "super-administrateur":
        role = await UserRole.findOne({ slug: bodyWR.role });
        break;
      case "admin":
      case "user":
        role = await UserRole.findOne({ slug: "user" });
        break;
      default:
        return res
          .status(403)
          .json({ message: CustomUtils.consts.UNAUTHORIZED });
    }

    if (!role) {
      return res.status(400).json({ message: "Invalid role specified!" });
    }

    // Vérification des emails existants
    if (bodyWR.email) {
      const existingEmail = await User.findOne({ email: bodyWR.email });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: CustomUtils.consts.EXISTING_ACCOUNT });
      }
    }

    bodyWR.role = role._id;
    bodyWR.complete_name = `${bodyWR.lastname || ""} ${bodyWR.firstname || ""}`;
    const newUser = await User.create(bodyWR);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Update user - Met à jour un utilisateur
// @route PUT /api/v1/users/:id
// @access Public
exports.updateUser = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const { id } = req.params;

    // Limiter les droits de mise à jour selon les rôles
    if (
      !hasAccess(userIn, ["super-administrateur", "admin"]) &&
      id !== userIn._id
    ) {
      return res.status(403).json({ message: CustomUtils.consts.UNAUTHORIZED });
    }

    const userUpdated = await User.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!userUpdated) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(userUpdated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete user - Supprime un utilisateur
// @route DELETE /api/v1/users/:id
// @access Public
exports.deleteUser = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const { id } = req.params;

    // Vérification des permissions
    if (
      !hasAccess(userIn, ["super-administrateur", "admin"]) &&
      id !== userIn._id
    ) {
      return res.status(403).json({ message: CustomUtils.consts.UNAUTHORIZED });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
