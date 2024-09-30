// const GeolocationService = require("./geolocationServicesModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all event geolocationServices
// // @route Get /api/v1/geolocationServices
// // @access Public
// exports.getAllGeolocationServices = async (req, res) => {
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
//     const geolocationServices = await GeolocationService.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(geolocationServices);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get event geolocationService by id
// // @route Get /api/v1/geolocationServices/:id
// // @access Public
// exports.getGeolocationServiceById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceSearch = await GeolocationService.find({
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
//       geolocationServiceSearch = await GeolocationService.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationService = geolocationServiceSearch[0];
//     if (!geolocationService)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     res.status(200).json(geolocationService);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Create new event geolocationService
// // @route Post /api/v1/geolocationServices
// // @access Public
// exports.createGeolocationService = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     const newgeolocationService = await GeolocationService.create(CustomBody);
//     res.status(201).json(newgeolocationService);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update event geolocationService by id
// // @route Patch /api/v1/geolocationServices/:id
// // @access Public
// exports.updateGeolocationServiceById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceSearch = await GeolocationService.find({
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
//       geolocationServiceSearch = await GeolocationService.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationService = geolocationServiceSearch[0];
//     if (!geolocationService)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });

//     const updated = await GeolocationService.findByIdAndUpdate(
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

// // @Delete event geolocationService by id
// // @route Delete /api/v1/geolocationServices/:id
// // @access Public
// exports.deleteGeolocationServiceById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceSearch = await GeolocationService.find({
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
//       geolocationServiceSearch = await GeolocationService.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const geolocationService = geolocationServiceSearch[0];
//     if (!geolocationService)
//       return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
//     await GeolocationService.findByIdAndDelete(req.params.id);
//     return res.status(200).json({});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const GeolocationService = require("./geolocationServicesModel.js");
const CustomUtils = require("../../utils/index.js");

// Helper function for role check
const isAdmin = (roleSlug) => {
  return ["super-administrateur", "admin"].includes(roleSlug);
};

// @Get all event geolocationServices
// @route Get /api/v1/geolocationServices
// @access Public
exports.getAllGeolocationServices = async (req, res) => {
  let { limit = 10, page = 1, sort, fields, _from } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  limit = parseInt(limit, 10);
  let skip = null;
  if (_from) limit = null;
  const userIn = await req.userIn();

  if (!isAdmin(userIn.role.slug)) {
    queryObj.user = userIn._id;
  }

  try {
    const geolocationServices = await GeolocationService.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sort || { createdAt: -1 }) // Default sorting by createdAt
      .select(fields);

    res.status(200).json(geolocationServices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get event geolocationService by id
// @route Get /api/v1/geolocationServices/:id
// @access Public
exports.getGeolocationServiceById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const searchCriteria = { _id: req.params.id };

    if (!isAdmin(userIn.role.slug)) {
      searchCriteria.user = userIn._id;
    }

    const geolocationService = await GeolocationService.findOne(searchCriteria);
    if (!geolocationService) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    res.status(200).json(geolocationService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new event geolocationService
// @route Post /api/v1/geolocationServices
// @access Public
exports.createGeolocationService = async (req, res) => {
  try {
    const CustomBody = { ...req.body };
    const userIn = await req.userIn();

    CustomBody.slug = CustomUtils.slugify(CustomBody.name);
    CustomBody.user = userIn._id;

    const newGeolocationService = await GeolocationService.create(CustomBody);
    res.status(201).json(newGeolocationService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update event geolocationService by id
// @route Patch /api/v1/geolocationServices/:id
// @access Public
exports.updateGeolocationServiceById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const searchCriteria = { _id: req.params.id };

    if (!isAdmin(userIn.role.slug)) {
      searchCriteria.user = userIn._id;
    }

    const geolocationService = await GeolocationService.findOne(searchCriteria);
    if (!geolocationService) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    const updatedService = await GeolocationService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete event geolocationService by id
// @route Delete /api/v1/geolocationServices/:id
// @access Public
exports.deleteGeolocationServiceById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const searchCriteria = { _id: req.params.id };

    if (!isAdmin(userIn.role.slug)) {
      searchCriteria.user = userIn._id;
    }

    const geolocationService = await GeolocationService.findOne(searchCriteria);
    if (!geolocationService) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    }

    await GeolocationService.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Geolocation Service deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
