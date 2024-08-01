const GtnTag = require("./gtnTagsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all tags types
// @Route: /api/v1/tags
// @Access: Public
exports.getAllGtnTags = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const tags = await GtnTag.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(tags);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get tag type by id
// @Route: /api/v1/tags/:id
// @Access: Public
exports.getGtnTagById = async (req, res) => {
  try {
    // get tag type by id
    const tag = await GtnTag.findById(req.params.id);
    if (!tag)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new tag type
// @Route: /api/v1/tags
// @Access: Private
exports.createGtnTag = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new tag type
    const tag = await GtnTag.create(CustomBody);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update tag type by id
// @Route: /api/v1/tags/:id
// @Access: Private
exports.updateGtnTag = async (req, res) => {
  try {
    const tag = await GtnTag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "tag not found !" });
    }

    const updated = await GtnTag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete tag type by id
// @Route: /api/v1/tags/:id
// @Access: Private
exports.deleteGtnTag = async (req, res, next) => {
  try {
    const tag = await GtnTag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: `tag not found !` });
    await GtnTag.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "tag deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
