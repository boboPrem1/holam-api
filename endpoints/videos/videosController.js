const Video = require("./videosModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all video
// @Route: /api/v1/videos
// @Access: Public
exports.getAllVideos = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
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
    const video = await Video.findById(req.params.id);
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
  try {
    CustomBody.slug = slug;
    // create new video     
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
    const video = await Video.findById(req.params.id);
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
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: `video not found !` });
    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "video deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
