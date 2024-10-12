// const Comment = require("./commentsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all comment
// // @Route: /api/v1/comments
// // @Access: Public
// exports.getAllComments = async (req, res, next) => {
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
//     const comments = await Comment.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(comments);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get comment by id
// // @Route: /api/v1/comments/:id
// // @Access: Public
// exports.getCommentById = async (req, res) => {
//   try {
//     // get comment by id
//     const userIn = await req.userIn();

//     let commentSearch = await Comment.find({
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
//       commentSearch = await Comment.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const comment = commentSearch[0];
//     if (!comment)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(comment);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new comment // @Route: /api/v1/comments
// // @Access: Private
// exports.createComment = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);
//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new comment
//     const comment = await Comment.create(CustomBody);
//     res.status(201).json(comment);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update comment by id
// // @Route: /api/v1/comments/:id
// // @Access: Private
// exports.updateComment = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let commentSearch = await Comment.find({
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
//       commentSearch = await Comment.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const comment = commentSearch[0];
//     if (!comment) {
//       return res.status(404).json({ message: "comment not found !" });
//     }

//     const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete comment by id
// // @Route: /api/v1/comments/:id
// // @Access: Private
// exports.deleteComment = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let commentSearch = await Comment.find({
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
//       commentSearch = await Comment.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const comment = commentSearch[0];
//     if (!comment)
//       return res.status(404).json({ message: `comment not found !` });
//     await Comment.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "comment deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Comment = require("./commentsModel.js");
const Video = require("../videos/videosModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all comments
// @Route: /api/v1/comments
// @Access: Public
exports.getAllComments = async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, fields, _from } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

    // Restrict comments to the current user if not admin or super-admin
    if (!["super-administrateur", "admin"].includes(userIn.role.slug)) {
      queryObj.user = userIn._id;
    }

    const comments = await Comment.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1, ...sort })
      .select(fields?.split(",").join(" ")); // Ensure proper field selection

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get comment by id
// @Route: /api/v1/comments/:id
// @Access: Public
exports.getCommentById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    // Build query conditionally based on user role
    const query = {
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
        userIn.role.slug !== "admin" && { user: userIn._id }),
    };

    const comment = await Comment.findOne(query);

    if (!comment) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get comment by id
// @Route: /api/v1/comments/:id
// @Access: Public
exports.AddCommentToAVideo = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const query = {
      _id: req.params.id,
    };

    const video = await Video.findOne(query);

    if (!video) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    const comment = await Comment.create({
      user: userIn._id,
      video: video._id,
      content: req.body.content,
    });

    if (!comment) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    const updated = await Video.findByIdAndUpdate(
      video._id,
      {
        $push: { comments: comment._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get comment by id
// @Route: /api/v1/comments/:id
// @Access: Public
exports.RemoveCommentFromAVideo = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const query = {
      _id: req.params.id,
    };

    const video = await Video.findOne({
      comments: {
        $in: req.params.id,
      },
    });

    if (!video) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    const comment = await Comment.findByIdAndDelete(query);

    if (!comment) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    const updated = await Video.findByIdAndUpdate(
      video._id,
      {
        $pull: { comments: comment._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new comment
// @Route: /api/v1/comments
// @Access: Private
exports.createComment = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const CustomBody = { ...req.body, user: userIn._id };

    // Generate slug
    CustomBody.slug = CustomUtils.slugify(CustomBody.name);

    // Create new comment
    const comment = await Comment.create(CustomBody);

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update comment by id
// @Route: /api/v1/comments/:id
// @Access: Private
exports.updateComment = async (req, res) => {
  try {
    const userIn = await req.userIn();

    // Build query conditionally based on user role
    const query = {
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
        userIn.role.slug !== "admin" && { user: userIn._id }),
    };

    const comment = await Comment.findOne(query);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete comment by id
// @Route: /api/v1/comments/:id
// @Access: Private
exports.deleteComment = async (req, res) => {
  try {
    const userIn = await req.userIn();

    // Build query conditionally based on user role
    const query = {
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
        userIn.role.slug !== "admin" && { user: userIn._id }),
    };

    const comment = await Comment.findOne(query);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
