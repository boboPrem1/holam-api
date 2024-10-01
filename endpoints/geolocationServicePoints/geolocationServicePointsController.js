// const GeolocationServicePoint = require("./geolocationServicePointsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all geolocationServicePoints
// // @Route: /api/v1/geolocationServicePoints
// // @Access: Public
// exports.getAllGeolocationServicePoints = async (req, res, next) => {
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
//     const geolocationServicePoints = await GeolocationServicePoint.find(
//       queryObj
//     )
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(geolocationServicePoints);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get geolocationServicePoint by id
// // @Route: /api/v1/geolocationServicePoints/:id
// // @Access: Public
// exports.getGeolocationServicePointById = async (req, res) => {
//   try {
//     // get geolocationServicePoint by id
//     const userIn = await req.userIn();

//     let geolocationServicePointSearch = await GeolocationServicePoint.find({
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
//       geolocationServicePointSearch = await GeolocationServicePoint.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServicePoint = geolocationServicePointSearch[0];
//     if (!geolocationServicePoint)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(geolocationServicePoint);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new geolocationServicePoint
// // @Route: /api/v1/geolocationServicePoints
// // @Access: Private
// exports.createGeolocationServicePoint = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new geolocationServicePoint
//     const geolocationServicePoint = await GeolocationServicePoint.create(
//       CustomBody
//     );
//     res.status(201).json(geolocationServicePoint);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update geolocationServicePoint by id
// // @Route: /api/v1/geolocationServicePoints/:id
// // @Access: Private
// exports.updateGeolocationServicePoint = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServicePointSearch = await GeolocationServicePoint.find({
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
//       geolocationServicePointSearch = await GeolocationServicePoint.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServicePoint = geolocationServicePointSearch[0];
//     if (!geolocationServicePoint) {
//       return res
//         .status(404)
//         .json({ message: "geolocationServicePoint not found !" });
//     }

//     const updated = await GeolocationServicePoint.findByIdAndUpdate(
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

// // @Delete geolocationServicePoint by id
// // @Route: /api/v1/geolocationServicePoints/:id
// // @Access: Private
// exports.deleteGeolocationServicePoint = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServicePointSearch = await GeolocationServicePoint.find({
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
//       geolocationServicePointSearch = await GeolocationServicePoint.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServicePoint = geolocationServicePointSearch[0];
//     if (!geolocationServicePoint)
//       return res
//         .status(404)
//         .json({ message: `geolocationServicePoint not found !` });
//     await GeolocationServicePoint.findByIdAndDelete(req.params.id);
//     res
//       .status(200)
//       .json({ message: "geolocationServicePoint deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const GeolocationServicePoint = require("./geolocationServicePointsModel.js");
const CustomUtils = require("../../utils/index.js");
const GeolocationServiceAgent = require("../geolocationServiceAgents/geolocationServiceAgentsModel.js");
const GeolocationServiceMaster = require("../geolocationServiceMasters/geolocationServiceMastersModel.js");
const GeolocationServiceClient = require("../geolocationServiceClients/geolocationServicesClientsModel.js");
const Otp = require("../otps/otpsModel.js");
const User = require("../users/userModel.js");

const isAdminOrSuperAdmin = (user) =>
  user.role.slug === "super-administrateur" || user.role.slug === "admin";

// @Get all geolocationServicePoints
// @Route: /api/v1/geolocationServicePoints
// @Access: Public
// exports.getAllGeolocationServicePoints = async (req, res) => {
//   let { limit = 10, page = 1, sort = {}, fields, _from } = req.query;
//   limit = parseInt(limit, 10);
//   let skip = null;
//   if (_from) limit = null;
//   const queryObj = CustomUtils.advancedQuery(req.query);

//   try {
//     const userIn = await req.userIn();
//     let master = await GeolocationServiceMaster.findOne({
//       user: userIn._id,
//     });
//     let client = await GeolocationServiceClient.findOne({
//       user: userIn._id,
//     });
//     let agent = await GeolocationServiceAgent.findOne({
//       user: userIn._id,
//     });
//     // Restrict query if not admin or super-admin

//     if (!isAdminOrSuperAdmin(userIn)) {
//       queryObj.user = userIn._id;
//       if (userIn.role.slug === "master") {
//         queryObj.master = master ? master._id : null;
//       } else if (userIn.role.slug === "client") {
//         queryObj.client = client ? client._id : null;
//       } else if (userIn.role.slug === "agent") {
//         queryObj.agent = agent ? agent._id : null;
//       }
//     }
//     console.log(queryObj);
//     const geolocationServicePoints = await GeolocationServicePoint.find(
//       queryObj
//     )
//       .limit(limit)
//       .skip(skip)
//       .sort({ createdAt: -1, ...sort })
//       .select(fields);

//     res.status(200).json(geolocationServicePoints);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

exports.getAllGeolocationServicePoints = async (req, res) => {
  let { limit = 10, page = 1, sort = {}, fields, _from } = req.query;
  limit = parseInt(limit, 10);
  page = parseInt(page, 10);

  // Calculer 'skip' uniquement si la pagination est nécessaire
  let skip = (page - 1) * limit;

  // Désactiver la limite si '_from' est défini
  if (_from) {
    limit = null;
    skip = null; // Pas besoin de pagination si '_from' est utilisé
  }

  const queryObj = CustomUtils.advancedQuery(req.query);

  try {
    const userIn = await req.userIn();

    // Rechercher les rôles correspondants au user
    let master = await GeolocationServiceMaster.findOne({ user: userIn._id });
    let client = await GeolocationServiceClient.findOne({ user: userIn._id });
    let agent = await GeolocationServiceAgent.findOne({ user: userIn._id });

    // Restriction de la requête si l'utilisateur n'est pas admin ou super-admin
    if (!isAdminOrSuperAdmin(userIn)) {
      queryObj.user = userIn._id;

      if (userIn.role.slug === "master") {
        queryObj.master = master ? master._id : null;
      } else if (userIn.role.slug === "client") {
        queryObj.client = client ? client._id : null;
      } else if (userIn.role.slug === "agent") {
        queryObj.agent = agent ? agent._id : null;
      }
    }

    // Debug pour voir le contenu de l'objet de requête
    // console.log(queryObj);

    // Exécuter la requête avec les paramètres paginés
    const geolocationServicePoints = await GeolocationServicePoint.find(
      queryObj
    )
      .limit(limit) // Limite de résultats
      .skip(skip) // Décalage (pagination)
      .sort({ createdAt: -1, ...sort }) // Tri
      .select(fields); // Champs à sélectionner

    res.status(200).json(geolocationServicePoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get geolocationServicePoint by id
// @Route: /api/v1/geolocationServicePoints/:id
// @Access: Public
exports.getGeolocationServicePointById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    // Add user constraint if not admin or super-admin

    if (
      !isAdminOrSuperAdmin(userIn) &&
      userIn.role.slug !== "master" &&
      userIn.role.slug !== "agent"
    ) {
      query.user = userIn._id;
      // if (userIn.role.slug === "master") {
      //   query.master = master ? master._id : null;
      // } else if (userIn.role.slug === "client") {
      //   query.client = client ? client._id : null;
      // } else if (userIn.role.slug === "agent") {
      //   query.agent = agent ? agent._id : null;
      // }
    }

    const geolocationServicePoint = await GeolocationServicePoint.findOne(
      query
    ).lean();

    if (!geolocationServicePoint) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(geolocationServicePoint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new geolocationServicePoint
// @Route: /api/v1/geolocationServicePoints
// @Access: Private
exports.createGeolocationServicePoint = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const slug = CustomUtils.slugify(req.body.name);

    let agent = null;
    let master = null;

    if (userIn.role.slug === "agent") {
      agent = await GeolocationServiceAgent.findOne({
        user: userIn._id,
      });
      master = agent.master._id;
    }
    if (userIn.role.slug === "master") {
      master = await GeolocationServiceMaster.findOne({
        user: userIn._id,
      });
    }

    const newGeolocationServicePoint = {
      agent: agent ? (agent ? agent._id : null) : null,
      master: master ? master._id : null,
      client: req.body.client,
      location: {
        type: "Point",
        coordinates: req.body.location.split(" ").map(Number),
      },
      days: req.body.days,
      amount: req.body.amount,
      user: userIn._id,
    };

    const geolocationServicePoint = await GeolocationServicePoint.create(
      newGeolocationServicePoint
    );
    res.status(201).json(geolocationServicePoint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createGeolocationServicePointSms = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const slug = CustomUtils.slugify(req.body.name);

    let agent = null;
    let master = null;

    if (userIn.role.slug === "agent") {
      agent = await GeolocationServiceAgent.findOne({
        user: userIn._id,
      });
      master = agent.master._id;
    }
    if (userIn.role.slug === "master") {
      master = await GeolocationServiceMaster.findOne({
        user: userIn._id,
      });
    }

    const newGeolocationServicePoint = {
      agent: agent ? (agent ? agent._id : null) : null,
      master: master ? master._id : null,
      client: req.body.client,
      location: {
        type: "Point",
        coordinates: req.body.location.split(" ").map(Number),
      },
      days: req.body.days,
      user: userIn._id,
    };

    let randomNumber = CustomUtils.getRandomNbr();
    let existingOtp = await Otp.findOne({ otp: randomNumber });

    const endingDate = new Date();
    endingDate.setDate(endingDate.getDate() + 7);

    while (existingOtp) {
      randomNumber = CustomUtils.getRandomNbr();
      existingOtp = await Otp.findOne({ otp: randomNumber });
    }

    const otp = await Otp.create({
      user: userIn._id,
      otp: randomNumber,
      exp: endingDate,
    });

    // Send sms
    const message = `Une cotisation veut etre créé pour vous avec les informations suivantes :
    Agent: ${agent.user.complete_name},
    Client: ${client.user.complete_name},
    Nombre de jours: ${req.body.days},
    Veuillez communiquer le code suivant à l'agent si tout est correct Code: ${otp.otp}.
    Avec HOLAM, des villes plus sûres.`;

    await CustomUtils.sendSMS(
      message,
      client.user.phone.indicatif,
      client.user.phone.number
    );

    // const geolocationServicePoint = await GeolocationServicePoint.create(
    //   newGeolocationServicePoint
    // );
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.activateAgent = async (req, res) => {
  try {
    const userIn = await req.userIn();

    if (userIn.role.slug === "agent") {
      const agent = await GeolocationServiceAgent.findOne({
        user: userIn._id,
      });
      console.log(agent);
      if (agent.otp.otp === req.body.code) {
        const result = await User.findByIdAndUpdate(
          agent.user._id,
          {
            agentIsActivated: true,
          },
          {
            new: true,
          }
        );
        console.log(result);
      } else {
        return res.status(403).json({ message: "Not Authorized" });
      }
    } else {
      return res.status(403).json({ message: "Not Authorized" });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update geolocationServicePoint by id
// @Route: /api/v1/geolocationServicePoints/:id
// @Access: Private
exports.updateGeolocationServicePoint = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };
    let master = await GeolocationServiceMaster.findOne({
      _id: userIn._id,
    });
    let client = await GeolocationServiceClient.findOne({
      _id: userIn._id,
    });
    let agent = await GeolocationServiceAgent.findOne({
      _id: userIn._id,
    });
    if (
      !isAdminOrSuperAdmin(userIn) &&
      userIn.role.slug !== "master" &&
      userIn.role.slug !== "agent"
    ) {
      query.user = userIn._id;
      // if (userIn.role.slug === "master") {
      //   query.master = master ? master._id : null;
      // } else if (userIn.role.slug === "client") {
      //   query.client = client ? client._id : null;
      // } else if (userIn.role.slug === "agent") {
      //   query.agent = agent ? agent._id : null;
      // }
    }

    const geolocationServicePoint = await GeolocationServicePoint.findOne(
      query
    ).lean();
    if (!geolocationServicePoint) {
      return res
        .status(404)
        .json({ message: "GeolocationServicePoint not found!" });
    }

    const updated = await GeolocationServicePoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete geolocationServicePoint by id
// @Route: /api/v1/geolocationServicePoints/:id
// @Access: Private
exports.deleteGeolocationServicePoint = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };
    let master = await GeolocationServiceMaster.findOne({
      _id: userIn._id,
    });
    let client = await GeolocationServiceClient.findOne({
      _id: userIn._id,
    });
    let agent = await GeolocationServiceAgent.findOne({
      _id: userIn._id,
    });

    if (
      !isAdminOrSuperAdmin(userIn) &&
      userIn.role.slug !== "master" &&
      userIn.role.slug !== "agent"
    ) {
      query.user = userIn._id;
      // if (userIn.role.slug === "master") {
      //   query.master = master ? master._id : null;
      // } else if (userIn.role.slug === "client") {
      //   query.client = client ? client._id : null;
      // } else if (userIn.role.slug === "agent") {
      //   query.agent = agent ? agent._id : null;
      // }
    }

    const geolocationServicePoint = await GeolocationServicePoint.findOne(
      query
    ).lean();
    if (!geolocationServicePoint) {
      return res
        .status(404)
        .json({ message: "GeolocationServicePoint not found!" });
    }

    await GeolocationServicePoint.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "GeolocationServicePoint deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
