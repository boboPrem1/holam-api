const Comment = require("./commentsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all comment
// @Route: /api/v1/comments
// @Access: Public
exports.getAllComments = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const comments = await Comment.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(comments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get comment by id
// @Route: /api/v1/comments/:id
// @Access: Public
exports.getCommentById = async (req, res) => {
  try {
    // get comment by id
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new comment // @Route: /api/v1/comments
// @Access: Private
exports.createComment = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new comment
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
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "comment not found !" });
    }

    const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete comment by id
// @Route: /api/v1/comments/:id
// @Access: Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: `comment not found !` });
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "comment deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
