// const File = require("./filesModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all files types
// // @Route: /api/v1/files
// // @Access: Public
// exports.getAllFiles = async (req, res, next) => {
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
//     const files = await File.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(files);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get file type by id
// // @Route: /api/v1/file/:id
// // @Access: Public
// exports.getFileById = async (req, res) => {
//   try {
//     // get file type by id
//     const userIn = await req.userIn();

//     let fileSearch = await File.find({
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
//       fileSearch = await File.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const file = fileSearch[0];
//     if (!file)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(file);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new file type
// // @Route: /api/v1/file
// // @Access: Private
// exports.createFile = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new file type
//     const file = await File.create(CustomBody);
//     res.status(201).json(file);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update file type by id
// // @Route: /api/v1/file/:id
// // @Access: Private
// exports.updateFile = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let fileSearch = await File.find({
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
//       fileSearch = await File.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const file = fileSearch[0];
//     if (!file) {
//       return res.status(404).json({ message: "file not found !" });
//     }

//     const updated = await File.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete file type by id
// // @Route: /api/v1/file/:id
// // @Access: Private
// exports.deleteFile = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let fileSearch = await File.find({
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
//       fileSearch = await File.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const file = fileSearch[0];
//     if (!file) return res.status(404).json({ message: `file not found !` });
//     await File.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "file deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const File = require("./filesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all files types
// @Route: /api/v1/files
// @Access: Public
exports.getAllFiles = async (req, res, next) => {
  let { limit = 10, page = 1, sort, fields, _from } = req.query;
  limit = parseInt(limit, 10);
  let skip = null;
  if (_from) limit = null;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();

  // Vérification des rôles
  if (
    userIn.role.slug !== "super-administrateur" &&
    userIn.role.slug !== "admin"
  ) {
    queryObj.user = userIn._id;
  }

  try {
    const files = await File.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields ? fields.replace(/,/g, " ") : "");

    res.status(200).json(files);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get file type by id
// @Route: /api/v1/file/:id
// @Access: Public
exports.getFileById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    // Requête de base pour trouver le fichier
    let query = { _id: req.params.id };
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const file = await File.findOne(query);
    if (!file) {
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    }
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new file type
// @Route: /api/v1/file
// @Access: Private
exports.createFile = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;

  try {
    CustomBody.slug = slug;
    const file = await File.create(CustomBody);
    res.status(201).json({
      status: "success",
      data: { file },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update file type by id
// @Route: /api/v1/file/:id
// @Access: Private
exports.updateFile = async (req, res) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const file = await File.findOne(query);
    if (!file) {
      return res.status(404).json({ message: "File not found!" });
    }

    const updated = await File.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      data: { updated },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete file type by id
// @Route: /api/v1/file/:id
// @Access: Private
exports.deleteFile = async (req, res, next) => {
  try {
    const userIn = await req.userIn();
    let query = { _id: req.params.id };

    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      query.user = userIn._id;
    }

    const file = await File.findOne(query);
    if (!file) {
      return res.status(404).json({ message: "File not found!" });
    }

    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "File deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
