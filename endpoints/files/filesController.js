const File = require("./filesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all files types
// @Route: /api/v1/files
// @Access: Public
exports.getAllFiles = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const files = await File.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
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
    // get file type by id
    const file = await File.findById(req.params.id);
    if (!file)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
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
  try {
    CustomBody.slug = slug;
    // create new file type
    const file = await File.create(CustomBody);
    res.status(201).json(file);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update file type by id
// @Route: /api/v1/file/:id
// @Access: Private
exports.updateFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "file not found !" });
    }

    const updated = await File.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete file type by id
// @Route: /api/v1/file/:id
// @Access: Private
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: `file not found !` });
    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "file deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
