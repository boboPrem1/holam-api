const Tag = require("./tagsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all tags types
// @Route: /api/v1/tags
// @Access: Public
exports.getAllTags = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
  try {
    const tags = await Tag.find(queryObj)
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
exports.getTagById = async (req, res) => {
  try {
    // get tag type by id
    const userIn = await req.userIn();

    const tagSearch = await Tag.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const tag = tagSearch[0];
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
exports.createTag = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    // create new tag type
    const tag = await Tag.create(CustomBody);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update tag type by id
// @Route: /api/v1/tags/:id
// @Access: Private
exports.updateTag = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const tagSearch = await Tag.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const tag = tagSearch[0];
    if (!tag) {
      return res.status(404).json({ message: "tag not found !" });
    }

    const updated = await Tag.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deleteTag = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    const tagSearch = await Tag.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const tag = tagSearch[0];
    if (!tag) return res.status(404).json({ message: `tag not found !` });
    await Tag.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "tag deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
