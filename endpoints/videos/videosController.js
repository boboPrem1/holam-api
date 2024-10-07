// const Video = require("./videosModel.js");
// const CustomUtils = require("../../utils/index.js");
// const File = require("../files/filesModel.js");

// // @Get all video
// // @Route: /api/v1/videos
// // @Access: Public
// exports.getAllVideos = async (req, res, next) => {
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
//     const videos = await Video.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(videos);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get video by id
// // @Route: /api/v1/videos/:id
// // @Access: Public
// exports.getVideoById = async (req, res) => {
//   try {
//     // get video by id
//     const userIn = await req.userIn();

//     let videoSearch = await Video.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       Video: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       videoSearch = await User.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const video = videoSearch[0];
//     if (!video)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(video);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new video // @Route: /api/v1/videos
// // @Access: Private
// exports.createVideo = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;

//     if (CustomBody.video) {
//       const video = await File.findById(CustomBody.video);
//       if (video) {
//         CustomBody.video = video.id;
//       }
//     }
//     // console.log(CustomBody);
//     // create new video
//     const video = await Video.create(CustomBody);
//     // console.log
//     res.status(201).json(video);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update video by id
// // @Route: /api/v1/videos/:id
// // @Access: Private
// exports.updateVideo = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let videoSearch = await Video.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       Video: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       videoSearch = await User.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const video = videoSearch[0];
//     if (!video) {
//       return res.status(404).json({ message: "video not found !" });
//     }

//     const updated = await Video.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete video by id
// // @Route: /api/v1/videos/:id
// // @Access: Private
// exports.deleteVideo = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let videoSearch = await Video.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       Video: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       videoSearch = await User.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const video = videoSearch[0];
//     if (!video) return res.status(404).json({ message: `video not found !` });
//     await Video.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "video deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Video = require("./videosModel.js");
const CustomUtils = require("../../utils/index.js");
const File = require("../files/filesModel.js");
const Tag = require("../tags/tagsModel.js");

// @Get all videos
// @Route: /api/v1/videos
// @Access: Public
exports.getAllVideos = async (req, res) => {
  let { limit = 10, page = 1, sort, fields, _from } = req.query;
  limit = parseInt(limit, 10);
  let skip = null;
  if (_from) limit = null;
  const queryObj = CustomUtils.advancedQuery(req.query);

  try {
    const userIn = await req.userIn();

    // Restreindre les vidéos à l'utilisateur courant si non admin
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.user = userIn._id;
    }

    const videos = await Video.find(queryObj)
      .limit(Number(limit))
      .skip((Number(page) - 1) * limit)
      .sort({ createdAt: -1, ...sort })
      .select(fields ? fields.split(",").join(" ") : ""); // Sélection des champs si spécifié

    res.status(200).json(videos);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get video by id
// @Route: /api/v1/videos/:id
// @Access: Public
exports.getVideoById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const video = await Video.findOne({
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
        ? { user: userIn._id } // Restreindre aux vidéos de l'utilisateur courant si non admin
        : {}),
    });

    if (!video)
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new video
// @Route: /api/v1/videos
// @Access: Private
exports.createVideo = async (req, res) => {
  try {
    const CustomBody = { ...req.body };
    const slug = CustomUtils.slugify(CustomBody.name);
    const userIn = await req.userIn();
    CustomBody.user = userIn._id;
    CustomBody.slug = slug;

    const tagsToCreate = CustomBody.tags.split(";");
    const tags = [];

    for (const tag of tagsToCreate) {
      // console.log(tag);
      const existingTag = await Tag.find({
        $or: [{ name: tag }, { slug: tag }],
      });

      if (!existingTag.length) {
        const newTag = await Tag.create({
          name: tag,
          slug: CustomUtils.slugify(tag),
          user: userIn._id,
        });
        tags.push(newTag._id);
      } else {
        tags.push(existingTag[0]._id);
      }
    }

    CustomBody.tags = [...tags];

    if (CustomBody.video) {
      const video = await File.findById(CustomBody.video);
      if (video) {
        CustomBody.video = video._id; // Assigner l'ID de la vidéo s'il existe
      }
    }

    const video = await Video.create(CustomBody);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update video by id
// @Route: /api/v1/videos/:id
// @Access: Private
exports.updateVideo = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const video = await Video.findOne({
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
        ? { user: userIn._id }
        : {}),
    });

    if (!video) return res.status(404).json({ message: "Video not found!" });

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete video by id
// @Route: /api/v1/videos/:id
// @Access: Private
exports.deleteVideo = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const video = await Video.findOne({
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
        ? { user: userIn._id }
        : {}),
    });

    if (!video) return res.status(404).json({ message: "Video not found!" });

    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Video deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
