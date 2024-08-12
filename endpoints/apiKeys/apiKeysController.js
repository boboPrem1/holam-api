const ApiKey = require("./apiKeysModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all opportunity types
// @Route: /api/v1/opportunity_targets
// @Access: Public
exports.getAllApiKeys = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
  try {
    const ApiKeys = await ApiKey.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(ApiKeys);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get opportunity type by id
// @Route: /api/v1/opportunity_targets/:id
// @Access: Public
exports.getApiKeyById = async (req, res) => {
  try {
    // get opportunity type by id
    const userIn = await req.userIn();

    const apiKeySearch = await ApiKey.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const apiKey = apiKeySearch[0];
    if (!apiKey)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(apiKey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new opportunity type
// @Route: /api/v1/opportunity_targets
// @Access: Private
exports.createApiKey = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    let key = "";
    let keyExist = true;

    while (keyExist) {
      key = CustomUtils.getRandomStr(64);
      const result = await ApiKey.find({
        key: { $eq: key },
      });
      result.length > 0 ? (keyExist = true) : (keyExist = false);
    }
    // create new opportunity type
    const apiKey = await ApiKey.create({ ...CustomBody, key });
    res.status(201).json(apiKey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update opportunity type by id
// @Route: /api/v1/opportunity_targets/:id
// @Access: Private
exports.updateApiKey = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const apiKeySearch = await ApiKey.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const apiKey = apiKeySearch[0];
    if (!apiKey) {
      return res.status(404).json({ message: "apiKey not found !" });
    }

    const updated = await ApiKey.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete opportunity type by id
// @Route: /api/v1/opportunity_targets/:id
// @Access: Private
exports.deleteApiKey = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    const apiKeySearch = await ApiKey.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const apiKey = apiKeySearch[0];
    if (!apiKey) return res.status(404).json({ message: `apiKey not found !` });
    await ApiKey.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "apiKey deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
