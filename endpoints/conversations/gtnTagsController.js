// const GtnTag = require("./gtnTagsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all tags types
// // @Route: /api/v1/tags
// // @Access: Public
// exports.getAllGtnTags = async (req, res, next) => {
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
//     const tags = await GtnTag.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(tags);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get tag type by id
// // @Route: /api/v1/tags/:id
// // @Access: Public
// exports.getGtnTagById = async (req, res) => {
//   try {
//     // get tag type by id
//     const userIn = await req.userIn();

//     let tagSearch = await GtnTag.find({
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
//       tagSearch = await GtnTag.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const tag = tagSearch[0];
//     if (!tag)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(tag);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new tag type
// // @Route: /api/v1/tags
// // @Access: Private
// exports.createGtnTag = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);
//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new tag type
//     const tag = await GtnTag.create(CustomBody);
//     res.status(201).json(tag);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update tag type by id
// // @Route: /api/v1/tags/:id
// // @Access: Private
// exports.updateGtnTag = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let tagSearch = await GtnTag.find({
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
//       tagSearch = await GtnTag.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const tag = tagSearch[0];
//     if (!tag) {
//       return res.status(404).json({ message: "tag not found !" });
//     }

//     const updated = await GtnTag.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete tag type by id
// // @Route: /api/v1/tags/:id
// // @Access: Private
// exports.deleteGtnTag = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let tagSearch = await GtnTag.find({
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
//       tagSearch = await GtnTag.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const tag = tagSearch[0];
//     if (!tag) return res.status(404).json({ message: `tag not found !` });
//     await GtnTag.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "tag deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const GtnTag = require("./gtnTagsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all tags types
// @Route: /api/v1/tags
// @Access: Public
exports.getAllGtnTags = async (req, res, next) => {
  let { limit = 10, page = 1, sort, fields, _from } = req.query;
  limit = parseInt(limit, 10);
  let skip = null;
  if (_from) limit = null;
  const queryObj = CustomUtils.advancedQuery(req.query);

  try {
    const userIn = await req.userIn();

    // Restrict access for non-admin users
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.user = userIn._id;
    }

    const tags = await GtnTag.find(queryObj)
      .limit(limit)
      .skip(skip) // Pagination
      .sort({ createdAt: -1, ...sort })
      .select(fields);

    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

// @Get tag type by id
// @Route: /api/v1/tags/:id
// @Access: Public
exports.getGtnTagById = async (req, res, next) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    // Allow only the owner or admin to access the tag
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const tag = await GtnTag.findOne(query);
    if (!tag) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
};

// @Create new tag type
// @Route: /api/v1/tags
// @Access: Private
exports.createGtnTag = async (req, res, next) => {
  try {
    const CustomBody = { ...req.body };
    const slug = CustomUtils.slugify(CustomBody.name);
    const userIn = await req.userIn();

    CustomBody.user = userIn._id;
    CustomBody.slug = slug;

    const tag = await GtnTag.create(CustomBody);
    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

// @Update tag type by id
// @Route: /api/v1/tags/:id
// @Access: Private
exports.updateGtnTag = async (req, res, next) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    // Restrict update access for non-admin users
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const tag = await GtnTag.findOne(query);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found!" });
    }

    const updatedTag = await GtnTag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTag);
  } catch (error) {
    next(error);
  }
};

// @Delete tag type by id
// @Route: /api/v1/tags/:id
// @Access: Private
exports.deleteGtnTag = async (req, res, next) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    // Restrict delete access for non-admin users
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const tag = await GtnTag.findOne(query);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found!" });
    }

    await GtnTag.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tag deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
