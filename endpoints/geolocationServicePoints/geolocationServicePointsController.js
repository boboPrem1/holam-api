// const GeolocationServicePoint = require("./geolocationServicePointsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all geolocationServicePoints
// // @Route: /api/v1/geolocationServicePoints
// // @Access: Public
// exports.getAllGeolocationServicePoints = async (req, res, next) => {
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
//     const geolocationServicePoints = await GeolocationServicePoint.find(
//       queryObj
//     )
//       .limit(limit * 1)
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

const isAdminOrSuperAdmin = (user) =>
  user.role.slug === "super-administrateur" || user.role.slug === "admin";

// @Get all geolocationServicePoints
// @Route: /api/v1/geolocationServicePoints
// @Access: Public
exports.getAllGeolocationServicePoints = async (req, res) => {
  const { limit = 10, page = 1, sort = {}, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);

  try {
    const userIn = await req.userIn();

    // Restrict query if not admin or super-admin
    if (!isAdminOrSuperAdmin(userIn)) {
      queryObj.user = userIn._id;
    }

    const geolocationServicePoints = await GeolocationServicePoint.find(
      queryObj
    )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1, ...sort })
      .select(fields)
      .lean();

    res.status(200).json(geolocationServicePoints);
  } catch (error) {
    res.status(404).json({ message: error.message });
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
    if (!isAdminOrSuperAdmin(userIn)) {
      query.user = userIn._id;
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

    const newGeolocationServicePoint = {
      ...req.body,
      slug,
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

// @Update geolocationServicePoint by id
// @Route: /api/v1/geolocationServicePoints/:id
// @Access: Private
exports.updateGeolocationServicePoint = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (!isAdminOrSuperAdmin(userIn)) {
      query.user = userIn._id;
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

    if (!isAdminOrSuperAdmin(userIn)) {
      query.user = userIn._id;
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
