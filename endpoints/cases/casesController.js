// const Case = require("./holam_casesModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all holam_cases
// // @Route: /api/v1/holam_cases
// // @Access: Public
// exports.getAllCases = async (req, res, next) => {
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
//     const holam_cases = await Case.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(holam_cases);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get holam_case by id
// // @Route: /api/v1/holam_cases/:id
// // @Access: Public
// exports.getCaseById = async (req, res) => {
//   try {
//     // get holam_case by id
//     const userIn = await req.userIn();

//     let holam_caseSearch = await Case.find({
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
//       holam_caseSearch = await Case.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const holam_case = holam_caseSearch[0];
//     if (!holam_case)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(holam_case);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new holam_case
// // @Route: /api/v1/holam_cases
// // @Access: Private
// exports.createCase = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new holam_case
//     const holam_case = await Case.create(CustomBody);
//     res.status(201).json(holam_case);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update holam_case by id
// // @Route: /api/v1/holam_cases/:id
// // @Access: Private
// exports.updateCase = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let holam_caseSearch = await Case.find({
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
//       holam_caseSearch = await Case.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const holam_case = holam_caseSearch[0];
//     if (!holam_case) {
//       return res.status(404).json({ message: "holam_case not found !" });
//     }

//     const updated = await Case.findByIdAndUpdate(
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

// // @Delete holam_case by id
// // @Route: /api/v1/holam_cases/:id
// // @Access: Private
// exports.deleteCase = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let holam_caseSearch = await Case.find({
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
//       holam_caseSearch = await Case.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const holam_case = holam_caseSearch[0];
//     if (!holam_case)
//       return res.status(404).json({ message: `holam_case not found !` });
//     await Case.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "holam_case deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Case = require("./holam_casesModel.js");
const CustomUtils = require("../../utils/index.js");

// Helper function to check user role
const isAdminOrSuperAdmin = (user) =>
  user.role.slug === "super-administrateur" || user.role.slug === "admin";

// @Get all holam_cases
// @Route: /api/v1/holam_cases
// @Access: Public
exports.getAllCases = async (req, res, next) => {
  try {
    let { limit, page, sort, fields, _from } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

    // If not admin or super-admin, limit holam_cases to the user's own records
    if (!isAdminOrSuperAdmin(userIn)) {
      queryObj.user = userIn._id;
    }

    const holam_cases = await Case.find(queryObj)
      .limit(Number(limit) || 10)
      .skip((Number(page) - 1) * Number(limit) || 0)
      .sort({ createdAt: -1, ...sort })
      .select(fields);

    res.status(200).json(holam_cases);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to fetch holam_cases", error: error.message });
  }
};

// @Get holam_case by id
// @Route: /api/v1/holam_cases/:id
// @Access: Public
exports.getCaseById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let holam_caseQuery = { _id: req.params.id };

    if (!isAdminOrSuperAdmin(userIn)) {
      holam_caseQuery.user = userIn._id;
    }

    const holam_case = await Case.findOne(holam_caseQuery);

    if (!holam_case) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(holam_case);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching holam_case", error: error.message });
  }
};

// @Create new holam_case
// @Route: /api/v1/holam_cases
// @Access: Private
exports.createCase = async (req, res) => {
  try {
    const CustomBody = { ...req.body };
    const slug = CustomUtils.slugify(CustomBody.name);
    const userIn = await req.userIn();

    CustomBody.user = userIn._id;
    CustomBody.slug = slug;

    const holam_case = await Case.create(CustomBody);

    res.status(201).json(holam_case);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating holam_case", error: error.message });
  }
};

// @Update holam_case by id
// @Route: /api/v1/holam_cases/:id
// @Access: Private
exports.updateCase = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let holam_caseQuery = { _id: req.params.id };

    if (!isAdminOrSuperAdmin(userIn)) {
      holam_caseQuery.user = userIn._id;
    }

    const holam_case = await Case.findOne(holam_caseQuery);

    if (!holam_case) {
      return res.status(404).json({ message: "Case not found!" });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedCase);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating holam_case", error: error.message });
  }
};

// @Delete holam_case by id
// @Route: /api/v1/holam_cases/:id
// @Access: Private
exports.deleteCase = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let holam_caseQuery = { _id: req.params.id };

    if (!isAdminOrSuperAdmin(userIn)) {
      holam_caseQuery.user = userIn._id;
    }

    const holam_case = await Case.findOne(holam_caseQuery);

    if (!holam_case) {
      return res.status(404).json({ message: "Case not found!" });
    }

    await Case.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Case deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting holam_case", error: error.message });
  }
};
