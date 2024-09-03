const Video = require("./videosModel.js");
const CustomUtils = require("../../utils/index.js");
const File = require("../files/filesModel.js")

// @Get all video
// @Route: /api/v1/videos
// @Access: Public
exports.getAllVideos = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
  try {
    const videos = await Video.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
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
    // get video by id
    const userIn = await req.userIn();

    const videoSearch = await Video.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const video = videoSearch[0];
    if (!video)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new video // @Route: /api/v1/videos
// @Access: Private
exports.createVideo = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;

    if (CustomBody.video) {
      const video = await File.findById(CustomBody.video);
      if (video) {
        CustomBody.video = video.id;
      }
    }
    // console.log(CustomBody);
    // create new video
    const video = await Video.create(CustomBody);
    // console.log
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

    const videoSearch = await Video.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const video = videoSearch[0];
    if (!video) {
      return res.status(404).json({ message: "video not found !" });
    }

    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete video by id
// @Route: /api/v1/videos/:id
// @Access: Private
exports.deleteVideo = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    const videoSearch = await Video.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const video = videoSearch[0];
    if (!video) return res.status(404).json({ message: `video not found !` });
    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "video deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
