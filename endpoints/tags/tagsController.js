// const Tag = require("./tagsModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all tags types
// // @Route: /api/v1/tags
// // @Access: Public
// exports.getAllTags = async (req, res, next) => {
//   let { limit, page, sort, fields, _from } = req.query;
//   const queryObj = CustomUtils.advancedQuery(req.query);
//   const userIn = await req.userIn();

//   try {
//     const tags = await Tag.find(queryObj)
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
// exports.getTagById = async (req, res) => {
//   try {
//     // get tag type by id
//     const userIn = await req.userIn();

//     const tagSearch = await Tag.find({
//       _id: {
//         $eq: req.params.id,
//       },
//     });
//     // }
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
// exports.createTag = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     // create new tag type
//     const tag = await Tag.create(CustomBody);
//     res.status(201).json(tag);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update tag type by id
// // @Route: /api/v1/tags/:id
// // @Access: Private
// exports.updateTag = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let tagSearch = await Tag.find({
//       _id: {
//         $eq: req.params.id,
//       },
//     });
//     const tag = tagSearch[0];
//     if (!tag) {
//       return res.status(404).json({ message: "tag not found !" });
//     }

//     const updated = await Tag.findByIdAndUpdate(req.params.id, req.body, {
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
// exports.deleteTag = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let tagSearch = await Tag.find({
//       _id: {
//         $eq: req.params.id,
//       },
//     });
//     const tag = tagSearch[0];
//     if (!tag) return res.status(404).json({ message: `tag not found !` });
//     await Tag.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "tag deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Tag = require("./tagsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all tags types
// @Route: /api/v1/tags
// @Access: Public
exports.getAllTags = async (req, res) => {
  let { limit = 10, page = 1, sort = "-createdAt", fields, _from } = req.query;
  limit = parseInt(limit, 10);
  let skip = null;
  if (_from) limit = null;
  const queryObj = CustomUtils.advancedQuery(req.query);

  try {
    const tags = await Tag.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .select(fields);

    res.status(200).json(tags);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve tags", error: error.message });
  }
};

// @Get tag type by id
// @Route: /api/v1/tags/:id
// @Access: Public
exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(tag);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve tag", error: error.message });
  }
};

// @Create new tag type
// @Route: /api/v1/tags
// @Access: Private
exports.createTag = async (req, res) => {
  try {
    const { name, ...rest } = req.body;
    const slug = CustomUtils.slugify(name);
    const userIn = await req.userIn();

    const tagData = {
      ...rest,
      name,
      slug,
      user: userIn._id,
    };

    const newTag = await Tag.create(tagData);
    res.status(201).json(newTag);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create tag", error: error.message });
  }
};

// @Update tag type by id
// @Route: /api/v1/tags/:id
// @Access: Private
exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedTag);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update tag", error: error.message });
  }
};

// @Delete tag type by id
// @Route: /api/v1/tags/:id
// @Access: Private
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    await Tag.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete tag", error: error.message });
  }
};
