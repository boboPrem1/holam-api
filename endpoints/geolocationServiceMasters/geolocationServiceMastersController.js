// const GeolocationServiceMaster = require("./geolocationServiceMastersModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all event geolocationServiceMasters
// // @route Get /api/v1/geolocationServiceMasters
// // @access Public
// exports.getAllGeolocationServiceMasters = async (req, res) => {
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
//     const geolocationServiceMasters = await GeolocationServiceMaster.find(
//       queryObj
//     )
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(geolocationServiceMasters);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get event geolocationServiceMaster by id
// // @route Get /api/v1/geolocationServiceMasters/:id
// // @access Public
// exports.getGeolocationServiceMasterById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceMasterSearch = await GeolocationServiceMaster.find({
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
//       geolocationServiceMasterSearch = await GeolocationServiceMaster.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServiceMaster = geolocationServiceMasterSearch[0];
//     if (!geolocationServiceMaster)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     res.status(200).json(geolocationServiceMaster);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Create new event geolocationServiceMaster
// // @route Post /api/v1/geolocationServiceMasters
// // @access Public
// exports.createGeolocationServiceMaster = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     const newgeolocationServiceMaster = await GeolocationServiceMaster.create(
//       CustomBody
//     );
//     res.status(201).json(newgeolocationServiceMaster);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update event geolocationServiceMaster by id
// // @route Patch /api/v1/geolocationServiceMasters/:id
// // @access Public
// exports.updateGeolocationServiceMasterById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceMasterSearch = await GeolocationServiceMaster.find({
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
//       geolocationServiceMasterSearch = await GeolocationServiceMaster.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServiceMaster = geolocationServiceMasterSearch[0];
//     if (!geolocationServiceMaster)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });

//     const updated = await GeolocationServiceMaster.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       }
//     );
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete event geolocationServiceMaster by id
// // @route Delete /api/v1/geolocationServiceMasters/:id
// // @access Public
// exports.deleteGeolocationServiceMasterById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceMasterSearch = await GeolocationServiceMaster.find({
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
//       geolocationServiceMasterSearch = await GeolocationServiceMaster.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServiceMaster = geolocationServiceMasterSearch[0];
//     if (!geolocationServiceMaster)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     await GeolocationServiceMaster.findByIdAndDelete(req.params.id);
//     return res.status(200).json({});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const GeolocationServiceMaster = require("./geolocationServiceMastersModel.js");
const CustomUtils = require("../../utils/index.js");
const GeolocationService = require("../geolocationServices/geolocationServicesModel.js");
const UserRole = require("../userRoles/userRoleModel.js");
const User = require("../users/userModel.js");

// Fonction utilitaire pour vérifier les privilèges d'admin
const isAdmin = (user) => {
  return ["super-administrateur", "admin"].includes(user.role.slug);
};

// @Get all geolocationServiceMasters
// @route Get /api/v1/geolocationServiceMasters
// @access Public
exports.getAllGeolocationServiceMasters = async (req, res) => {
  try {
    let {
      limit = 10,
      page = 1,
      sort = "-createdAt",
      fields,
      _from,
    } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

    // Si l'utilisateur n'est pas admin, filtrer par son ID
    if (!isAdmin(userIn)) {
      queryObj.user = userIn._id;
    }

    const geolocationServiceMasters = await GeolocationServiceMaster.find(
      queryObj
    )
      .limit(Number(limit))
      .skip(skip)
      .sort(sort)
      .select(fields);

    res.status(200).json(geolocationServiceMasters);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get geolocationServiceMaster by id
// @route Get /api/v1/geolocationServiceMasters/:id
// @access Public
exports.getGeolocationServiceMasterById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id };

    // Si l'utilisateur n'est pas admin, filtrer par son ID
    if (!isAdmin(userIn)) {
      query.user = userIn._id;
    }

    const geolocationServiceMaster = await GeolocationServiceMaster.findOne(
      query
    );

    if (!geolocationServiceMaster) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    res.status(200).json(geolocationServiceMaster);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Create new geolocationServiceMaster
// @route Post /api/v1/geolocationServiceMasters
// @access Public
exports.createGeolocationServiceMaster = async (req, res) => {
  try {
    const CustomBody = { ...req.body };
    const userIn = await req.userIn();
    let masterRole = await UserRole.findOne({
      slug: "master",
    });

    const phone = {
      indicatif: CustomBody.phone.indicatif,
      number: CustomBody.phone.number,
    };
    const lastname = CustomBody.lastname;
    const firstname = CustomBody.firstname;
    const description = CustomBody.description;
    const role = masterRole._id;

    const password = CustomUtils.generatePassword();

    const newUser = await User.create({
      password,
      confirmPassword: password,
      passwordIsSet: true,
      role,
      phone,
      firstname,
      lastname,
      complete_name: `${firstname} ${lastname}`,
      description,
      slug: CustomUtils.slugify(`${firstname} ${lastname}`),
    });

    // Send sms
    const message = `Vos informations de connexion au compte HOLAM: id: ${phone.number}, pass: ${password} Gardez-le secret. Veillez à modifier votre mot de passe dès votre première connexion. Avec HOLAM, des villes plus sûres.`;

    CustomBody.user = newUser._id;

    const newGeolocationServiceMaster = await GeolocationServiceMaster.create({
      user: newUser,
      service: CustomBody.service,
    });
    await CustomUtils.sendSMS(message, phone.indicatif, phone.number);
    res.status(201).json(newGeolocationServiceMaster);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update geolocationServiceMaster by id
// @route Patch /api/v1/geolocationServiceMasters/:id
// @access Public
exports.updateGeolocationServiceMasterById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id };

    // Si l'utilisateur n'est pas admin, filtrer par son ID
    if (!isAdmin(userIn)) {
      query.user = userIn._id;
    }

    const geolocationServiceMaster = await GeolocationServiceMaster.findOne(
      query
    );

    if (!geolocationServiceMaster) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    const updated = await GeolocationServiceMaster.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete geolocationServiceMaster by id
// @route Delete /api/v1/geolocationServiceMasters/:id
// @access Public
exports.deleteGeolocationServiceMasterById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id };

    // Si l'utilisateur n'est pas admin, filtrer par son ID
    if (!isAdmin(userIn)) {
      query.user = userIn._id;
    }

    const geolocationServiceMaster = await GeolocationServiceMaster.findOne(
      query
    );

    if (!geolocationServiceMaster) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    await GeolocationServiceMaster.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
