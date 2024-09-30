// const ApiKey = require("./apiKeysModel.js");
// const CustomUtils = require("../../utils/index.js");

// // @Get all opportunity types
// // @Route: /api/v1/opportunity_targets
// // @Access: Public
// exports.getAllApiKeys = async (req, res, next) => {
//   try {
//     let { limit = 10, page = 1, sort = "-createdAt", fields, _from } = req.query;
//     const queryObj = CustomUtils.advancedQuery(req.query);
//     const userIn = await req.userIn();

//     if (
//       userIn.role.slug !== "super-administrateur" &&
//       userIn.role.slug !== "admin"
//     ) {
//       queryObj.user = userIn._id;
//     }

//     const apiKeys = await ApiKey.find(queryObj)
//       .limit(limit)
//       .skip(skip)
//       .sort(sort)
//       .select(fields ? fields.split(",").join(" ") : "");

//     res.status(200).json(apiKeys);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get opportunity type by id
// // @Route: /api/v1/opportunity_targets/:id
// // @Access: Public
// exports.getApiKeyById = async (req, res) => {
//   try {
//     const userIn = await req.userIn();
//     const query = { _id: req.params.id };

//     if (
//       userIn.role.slug !== "super-administrateur" &&
//       userIn.role.slug !== "admin"
//     ) {
//       query.user = userIn._id;
//     }

//     const apiKey = await ApiKey.findOne(query);

//     if (!apiKey)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     res.status(200).json(apiKey);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new opportunity type
// // @Route: /api/v1/opportunity_targets
// // @Access: Private
// exports.createApiKey = async (req, res) => {
//   const CustomBody = { ...req.body };
//   const slug = CustomUtils.slugify(CustomBody.name);

//   const userIn = await req.userIn();
//   CustomBody.user = userIn._id;
//   try {
//     CustomBody.slug = slug;
//     let key = "";
//     let keyExist = true;

//     while (keyExist) {
//       key = CustomUtils.getRandomStr(64);
//       const result = await ApiKey.find({
//         key: { $eq: key },
//       });
//       result.length > 0 ? (keyExist = true) : (keyExist = false);
//     }
//     // create new opportunity type
//     const apiKey = await ApiKey.create({ ...CustomBody, key });
//     res.status(201).json(apiKey);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @Update opportunity type by id
// // @Route: /api/v1/opportunity_targets/:id
// // @Access: Private
// exports.updateApiKey = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let apiKeySearch = await ApiKey.find({
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
//       apiKeySearch = await ApiKey.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const apiKey = apiKeySearch[0];
//     if (!apiKey) {
//       return res.status(404).json({ message: "apiKey not found !" });
//     }

//     const updated = await ApiKey.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete opportunity type by id
// // @Route: /api/v1/opportunity_targets/:id
// // @Access: Private
// exports.deleteApiKey = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let apiKeySearch = await ApiKey.find({
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
//       apiKeySearch = await ApiKey.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const apiKey = apiKeySearch[0];
//     if (!apiKey) return res.status(404).json({ message: `apiKey not found !` });
//     await ApiKey.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "apiKey deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const ApiKey = require("./apiKeysModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all API keys
// @Route: /api/v1/opportunity_targets
// @Access: Public
exports.getAllApiKeys = async (req, res) => {
  try {
    let {
      limit = 10,
      page = 1,
      sort = "-createdAt",
      fields,
      _from,
    } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

    if (!["super-administrateur", "admin"].includes(userIn.role.slug)) {
      queryObj.user = userIn._id;
    }

    const apiKeys = await ApiKey.find(queryObj)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .select(fields ? fields.split(",").join(" ") : "");

    res.status(200).json(apiKeys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Get API key by id
// @Route: /api/v1/opportunity_targets/:id
// @Access: Public
exports.getApiKeyById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = { _id: req.params.id };

    if (!["super-administrateur", "admin"].includes(userIn.role.slug)) {
      query.user = userIn._id;
    }

    const apiKey = await ApiKey.findOne(query);

    if (!apiKey) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    res.status(200).json(apiKey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new API key
// @Route: /api/v1/opportunity_targets
// @Access: Private
exports.createApiKey = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const CustomBody = { ...req.body, user: userIn._id };
    CustomBody.slug = CustomUtils.slugify(CustomBody.name);

    let key;
    let keyExist = true;

    while (keyExist) {
      key = CustomUtils.getRandomStr(64);
      const existingKey = await ApiKey.findOne({ key });
      keyExist = !!existingKey;
    }

    const apiKey = await ApiKey.create({ ...CustomBody, key });
    res.status(201).json(apiKey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update API key by id
// @Route: /api/v1/opportunity_targets/:id
// @Access: Private
exports.updateApiKey = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = {
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
        userIn.role.slug !== "admin" && { user: userIn._id }),
    };

    const apiKey = await ApiKey.findOne(query);
    if (!apiKey) {
      return res.status(404).json({ message: "API key not found!" });
    }

    const updatedApiKey = await ApiKey.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedApiKey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete API key by id
// @Route: /api/v1/opportunity_targets/:id
// @Access: Private
exports.deleteApiKey = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const query = {
      _id: req.params.id,
      ...(userIn.role.slug !== "super-administrateur" &&
        userIn.role.slug !== "admin" && { user: userIn._id }),
    };

    const apiKey = await ApiKey.findOne(query);
    if (!apiKey) {
      return res.status(404).json({ message: "API key not found!" });
    }

    await ApiKey.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "API key deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
