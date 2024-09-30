// const GeolocationServiceTransaction = require("./geolocationServiceTransactionsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all geolocationServiceTransactions
// // @Route: /api/v1/geolocationServiceTransactions
// // @Access: Public
// exports.getAllGeolocationServiceTransactions = async (req, res, next) => {
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
//     const geolocationServiceTransactions =
//       await GeolocationServiceTransaction.find(queryObj)
//         .limit(limit)
//         .sort({
//           createdAt: -1,
//           ...sort,
//         })
//         .select(fields);
//     res.status(200).json(geolocationServiceTransactions);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get geolocationServiceTransaction by id
// // @Route: /api/v1/geolocationServiceTransactions/:id
// // @Access: Public
// exports.getGeolocationServiceTransactionById = async (req, res) => {
//   try {
//     // get geolocationServiceTransaction by id
//     const userIn = await req.userIn();

//     let geolocationServiceTransactionSearch =
//       await GeolocationServiceTransaction.find({
//         _id: {
//           $eq: req.params.id,
//         },
//         user: {
//           $eq: userIn._id,
//         },
//       });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       geolocationServiceTransactionSearch =
//         await GeolocationServiceTransaction.find({
//           _id: {
//             $eq: req.params.id,
//           },
//         });
//     }
//     const geolocationServiceTransaction =
//       geolocationServiceTransactionSearch[0];
//     if (!geolocationServiceTransaction)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(geolocationServiceTransaction);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new geolocationServiceTransaction
// // @Route: /api/v1/geolocationServiceTransactions
// // @Access: Private
// exports.createGeolocationServiceTransaction = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new geolocationServiceTransaction
//     const geolocationServiceTransaction =
//       await GeolocationServiceTransaction.create(CustomBody);
//     res.status(201).json(geolocationServiceTransaction);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update geolocationServiceTransaction by id
// // @Route: /api/v1/geolocationServiceTransactions/:id
// // @Access: Private
// exports.updateGeolocationServiceTransaction = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceTransactionSearch =
//       await GeolocationServiceTransaction.find({
//         _id: {
//           $eq: req.params.id,
//         },
//         user: {
//           $eq: userIn._id,
//         },
//       });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       geolocationServiceTransactionSearch =
//         await GeolocationServiceTransaction.find({
//           _id: {
//             $eq: req.params.id,
//           },
//         });
//     }
//     const geolocationServiceTransaction =
//       geolocationServiceTransactionSearch[0];
//     if (!geolocationServiceTransaction) {
//       return res
//         .status(404)
//         .json({ message: "geolocationServiceTransaction not found !" });
//     }

//     const updated = await GeolocationServiceTransaction.findByIdAndUpdate(
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

// // @Delete geolocationServiceTransaction by id
// // @Route: /api/v1/geolocationServiceTransactions/:id
// // @Access: Private
// exports.deleteGeolocationServiceTransaction = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let geolocationServiceTransactionSearch =
//       await GeolocationServiceTransaction.find({
//         _id: {
//           $eq: req.params.id,
//         },
//         user: {
//           $eq: userIn._id,
//         },
//       });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       geolocationServiceTransactionSearch =
//         await GeolocationServiceTransaction.find({
//           _id: {
//             $eq: req.params.id,
//           },
//         });
//     }
//     const geolocationServiceTransaction =
//       geolocationServiceTransactionSearch[0];
//     if (!geolocationServiceTransaction)
//       return res
//         .status(404)
//         .json({ message: `geolocationServiceTransaction not found !` });
//     await GeolocationServiceTransaction.findByIdAndDelete(req.params.id);
//     res.status(200).json({
//       message: "geolocationServiceTransaction deleted successfully !",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const GeolocationServiceTransaction = require("./geolocationServiceTransactionsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all geolocationServiceTransactions
// @Route: /api/v1/geolocationServiceTransactions
// @Access: Public
exports.getAllGeolocationServiceTransactions = async (req, res, next) => {
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
      queryObj.user = userIn._id; // Limit query to the current user if not admin
    }

    const geolocationServiceTransactions =
      await GeolocationServiceTransaction.find(queryObj)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1, ...sort })
        .select(fields);

    res.status(200).json(geolocationServiceTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get geolocationServiceTransaction by id
// @Route: /api/v1/geolocationServiceTransactions/:id
// @Access: Public
exports.getGeolocationServiceTransactionById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id; // Restrict query if not admin
    }

    const geolocationServiceTransaction =
      await GeolocationServiceTransaction.findOne(query);

    if (!geolocationServiceTransaction) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(geolocationServiceTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new geolocationServiceTransaction
// @Route: /api/v1/geolocationServiceTransactions
// @Access: Private
exports.createGeolocationServiceTransaction = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const CustomBody = { ...req.body, user: userIn._id };
    CustomBody.slug = CustomUtils.slugify(CustomBody.name);

    const geolocationServiceTransaction =
      await GeolocationServiceTransaction.create(CustomBody);
    res.status(201).json(geolocationServiceTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update geolocationServiceTransaction by id
// @Route: /api/v1/geolocationServiceTransactions/:id
// @Access: Private
exports.updateGeolocationServiceTransaction = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const geolocationServiceTransaction =
      await GeolocationServiceTransaction.findOne(query);

    if (!geolocationServiceTransaction) {
      return res
        .status(404)
        .json({ message: "geolocationServiceTransaction not found !" });
    }

    const updated = await GeolocationServiceTransaction.findByIdAndUpdate(
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

// @Delete geolocationServiceTransaction by id
// @Route: /api/v1/geolocationServiceTransactions/:id
// @Access: Private
exports.deleteGeolocationServiceTransaction = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const geolocationServiceTransaction =
      await GeolocationServiceTransaction.findOne(query);

    if (!geolocationServiceTransaction) {
      return res
        .status(404)
        .json({ message: "geolocationServiceTransaction not found !" });
    }

    await GeolocationServiceTransaction.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "geolocationServiceTransaction deleted successfully !",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
