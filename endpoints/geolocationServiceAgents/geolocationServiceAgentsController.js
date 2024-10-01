// const GeolocationServiceAgent = require("./geolocationServiceAgentsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all event geolocationServiceAgents
// // @route Get /api/v1/geolocationServiceAgents
// // @access Public
// exports.getAllGeolocationServiceAgents = async (req, res) => {
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
//     const geolocationServiceAgents = await GeolocationServiceAgent.find(
//       queryObj
//     )
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(geolocationServiceAgents);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get event geolocationServiceAgent by id
// // @route Get /api/v1/geolocationServiceAgents/:id
// // @access Public
// exports.getGeolocationServiceAgentById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceAgentSearch = await GeolocationServiceAgent.find({
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
//       geolocationServiceAgentSearch = await GeolocationServiceAgent.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServiceAgent = geolocationServiceAgentSearch[0];
//     if (!geolocationServiceAgent)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     res.status(200).json(geolocationServiceAgent);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Create new event geolocationServiceAgent
// // @route Post /api/v1/geolocationServiceAgents
// // @access Public
// exports.createGeolocationServiceAgent = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     const newgeolocationServiceAgent = await GeolocationServiceAgent.create(
//       CustomBody
//     );
//     res.status(201).json(newgeolocationServiceAgent);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update event geolocationServiceAgent by id
// // @route Patch /api/v1/geolocationServiceAgents/:id
// // @access Public
// exports.updateGeolocationServiceAgentById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceAgentSearch = await GeolocationServiceAgent.find({
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
//       geolocationServiceAgentSearch = await GeolocationServiceAgent.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServiceAgent = geolocationServiceAgentSearch[0];
//     if (!geolocationServiceAgent)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });

//     const updated = await GeolocationServiceAgent.findByIdAndUpdate(
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

// // @Delete event geolocationServiceAgent by id
// // @route Delete /api/v1/geolocationServiceAgents/:id
// // @access Public
// exports.deleteGeolocationServiceAgentById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceAgentSearch = await GeolocationServiceAgent.find({
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
//       geolocationServiceAgentSearch = await GeolocationServiceAgent.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServiceAgent = geolocationServiceAgentSearch[0];
//     if (!geolocationServiceAgent)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     await GeolocationServiceAgent.findByIdAndDelete(req.params.id);
//     return res.status(200).json({});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const GeolocationServiceAgent = require("./geolocationServiceAgentsModel.js");
const CustomUtils = require("../../utils/index.js");
const GeolocationServiceMaster = require("../geolocationServiceMasters/geolocationServiceMastersModel.js");
const UserRole = require("../userRoles/userRoleModel.js");
const User = require("../users/userModel.js");
const Otp = require("../otps/otpsModel.js");

// @Get all event geolocationServiceAgents
// @route Get /api/v1/geolocationServiceAgents
// @access Public
exports.getAllGeolocationServiceAgents = async (req, res) => {
  let { limit = 10, page = 1, sort = {}, fields, _from } = req.query;
  limit = parseInt(limit, 10);
  let skip = null;
  if (_from) limit = null;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();

  let master = await GeolocationServiceMaster.findOne({
    user: userIn._id,
  });
  // Filtrer les agents si l'utilisateur n'est pas admin ou super-admin
  if (
    userIn.role.slug !== "super-administrateur" &&
    userIn.role.slug !== "admin"
  ) {
    queryObj.master = master._id;
  }

  try {
    const geolocationServiceAgents = await GeolocationServiceAgent.find(
      queryObj
    )
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1, ...sort })
      .select(fields ? fields.split(",").join(" ") : "");

    res.status(200).json(geolocationServiceAgents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get event geolocationServiceAgent by id
// @route Get /api/v1/geolocationServiceAgents/:id
// @access Public
exports.getGeolocationServiceAgentById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    let master = await GeolocationServiceMaster.findOne({
      user: userIn._id,
    });
    const searchQuery = { _id: req.params.id };

    // Restreindre la recherche si l'utilisateur n'est pas admin
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      searchQuery.master = master._id;
    }

    const geolocationServiceAgent = await GeolocationServiceAgent.findOne(
      searchQuery
    );
    if (!geolocationServiceAgent) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    res.status(200).json(geolocationServiceAgent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new event geolocationServiceAgent
// @route Post /api/v1/geolocationServiceAgents
// @access Public
exports.createGeolocationServiceAgent = async (req, res) => {
  try {
    const CustomBody = { ...req.body };
    const userIn = await req.userIn();

    let master = await GeolocationServiceMaster.findOne({
      user: userIn._id,
    });

    let agentRole = await UserRole.findOne({
      slug: "agent",
    });

    const phone = {
      indicatif: CustomBody.phone.indicatif,
      number: CustomBody.phone.number,
    };
    const lastname = CustomBody.lastname;
    const firstname = CustomBody.firstname;
    const description = CustomBody.description;
    const role = agentRole._id;

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

    let randomNumber = CustomUtils.getRandomNbr();
    let existingOtp = await Otp.findOne({ otp: randomNumber });

    const endingDate = new Date();
    endingDate.setDate(endingDate.getDate() + 7);

    while (existingOtp) {
      randomNumber = CustomUtils.getRandomNbr();
      existingOtp = await Otp.findOne({ otp: randomNumber });
    }

    const otp = await Otp.create({
      user: newUser._id,
      otp: randomNumber,
      exp: endingDate,
    });

    // Send sms
    const message = `Vos informations de connexion au compte HOLAM: id: ${phone.number}, pass: ${password} Gardez-le secret. Par ailleurs le code d'activation de la partie microfinance dans l'application Holam est: ${otp.otp}, veuillez modifier votre mot de passe dès votre première connexion. Avec HOLAM, des villes plus sûres.`;

    CustomBody.user = userIn._id;

    const newGeolocationServiceAgent = await GeolocationServiceAgent.create({
      user: newUser,
      master,
      otp: otp._id,
    });
    await CustomUtils.sendSMS(message, phone.indicatif, phone.number);

    // const newGeolocationServiceAgent = await GeolocationServiceAgent.create(
    //   CustomBody
    // );
    res.status(201).json(newGeolocationServiceAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update event geolocationServiceAgent by id
// @route Patch /api/v1/geolocationServiceAgents/:id
// @access Public
exports.updateGeolocationServiceAgentById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    
    let master = await GeolocationServiceMaster.findOne({
      user: userIn._id,
    });
    const searchQuery = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      searchQuery.master = master._id;
    }

    const geolocationServiceAgent = await GeolocationServiceAgent.findOne(
      searchQuery
    );
    if (!geolocationServiceAgent) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    const updated = await GeolocationServiceAgent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete event geolocationServiceAgent by id
// @route Delete /api/v1/geolocationServiceAgents/:id
// @access Public
exports.deleteGeolocationServiceAgentById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    
    let master = await GeolocationServiceMaster.findOne({
      user: userIn._id,
    });
    const searchQuery = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      searchQuery.master = master._id;
    }

    const geolocationServiceAgent = await GeolocationServiceAgent.findOne(
      searchQuery
    );
    if (!geolocationServiceAgent) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    await GeolocationServiceAgent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
