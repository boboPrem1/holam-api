// const GeolocationServiceClient = require("./geolocationServicesClientsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all event geolocationServiceClients
// // @route Get /api/v1/geolocationServiceClients
// // @access Public
// exports.getAllGeolocationServiceClients = async (req, res) => {
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
//     const geolocationServiceClients = await GeolocationServiceClient.find(
//       queryObj
//     )
//       .limit(limit * 1)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(geolocationServiceClients);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get event geolocationServiceClient by id
// // @route Get /api/v1/geolocationServiceClients/:id
// // @access Public
// exports.getGeolocationServiceClientById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceClientSearch = await GeolocationServiceClient.find({
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
//       geolocationServiceClientSearch = await GeolocationServiceClient.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServiceClient = geolocationServiceClientSearch[0];
//     if (!geolocationServiceClient)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     res.status(200).json(geolocationServiceClient);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Create new event geolocationServiceClient
// // @route Post /api/v1/geolocationServiceClients
// // @access Public
// exports.createGeolocationServiceClient = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     const newgeolocationServiceClient = await GeolocationServiceClient.create(
//       CustomBody
//     );
//     res.status(201).json(newgeolocationServiceClient);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update event geolocationServiceClient by id
// // @route Patch /api/v1/geolocationServiceClients/:id
// // @access Public
// exports.updateGeolocationServiceClientById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceClientSearch = await GeolocationServiceClient.find({
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
//       geolocationServiceClientSearch = await GeolocationServiceClient.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServiceClient = geolocationServiceClientSearch[0];
//     if (!geolocationServiceClient)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });

//     const updated = await GeolocationServiceClient.findByIdAndUpdate(
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

// // @Delete event geolocationServiceClient by id
// // @route Delete /api/v1/geolocationServiceClients/:id
// // @access Public
// exports.deleteGeolocationServiceClientById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceClientSearch = await GeolocationServiceClient.find({
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
//       geolocationServiceClientSearch = await GeolocationServiceClient.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationServiceClient = geolocationServiceClientSearch[0];
//     if (!geolocationServiceClient)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     await GeolocationServiceClient.findByIdAndDelete(req.params.id);
//     return res.status(200).json({});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const GeolocationServiceClient = require("./geolocationServicesClientsModel.js");
const CustomUtils = require("../../utils/index.js");

// Middleware pour vérifier les rôles
const checkRole = (userIn) => {
  return (
    userIn.role.slug === "super-administrateur" || userIn.role.slug === "admin"
  );
};

// @Get all geolocationServiceClients
// @route Get /api/v1/geolocationServiceClients
// @access Public
exports.getAllGeolocationServiceClients = async (req, res) => {
  const { limit = 10, page = 1, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);

  try {
    const userIn = await req.userIn();
    if (!checkRole(userIn)) {
      queryObj.user = userIn._id; // Restrict to the current user's data
    }

    const geolocationServiceClients = await GeolocationServiceClient.find(
      queryObj
    )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort || { createdAt: -1 })
      .select(fields);

    res.status(200).json(geolocationServiceClients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get geolocationServiceClient by id
// @route Get /api/v1/geolocationServiceClients/:id
// @access Public
exports.getGeolocationServiceClientById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (!checkRole(userIn)) {
      query.user = userIn._id; // Restrict to the current user's data
    }

    const geolocationServiceClient = await GeolocationServiceClient.findOne(
      query
    );

    if (!geolocationServiceClient) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    res.status(200).json(geolocationServiceClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new geolocationServiceClient
// @route Post /api/v1/geolocationServiceClients
// @access Public
exports.createGeolocationServiceClient = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const CustomBody = {
      ...req.body,
      user: userIn._id,
      slug: CustomUtils.slugify(req.body.name),
    };

    const newGeolocationServiceClient = await GeolocationServiceClient.create(
      CustomBody
    );
    res.status(201).json(newGeolocationServiceClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update geolocationServiceClient by id
// @route Patch /api/v1/geolocationServiceClients/:id
// @access Public
exports.updateGeolocationServiceClientById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (!checkRole(userIn)) {
      query.user = userIn._id; // Restrict to the current user's data
    }

    const geolocationServiceClient = await GeolocationServiceClient.findOne(
      query
    );
    if (!geolocationServiceClient) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    const updated = await GeolocationServiceClient.findByIdAndUpdate(
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

// @Delete geolocationServiceClient by id
// @route Delete /api/v1/geolocationServiceClients/:id
// @access Public
exports.deleteGeolocationServiceClientById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (!checkRole(userIn)) {
      query.user = userIn._id; // Restrict to the current user's data
    }

    const geolocationServiceClient = await GeolocationServiceClient.findOne(
      query
    );
    if (!geolocationServiceClient) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    await GeolocationServiceClient.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Geolocation service client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
