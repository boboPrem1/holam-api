const City = require("./citiesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all cities types
// @Route: /api/v1/cities
// @Access: Public
exports.getAllCities = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
  try {
    const cities = await City.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(cities);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get city type by id
// @Route: /api/v1/cities/:id
// @Access: Public
exports.getCityById = async (req, res) => {
  try {
    // get city type by id
    const userIn = await req.userIn();

    const citySearch = await City.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const city = citySearch[0];
    if (!city)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new city type
// @Route: /api/v1/cities
// @Access: Private
exports.createCity = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    // create new city type
    const city = await City.create(CustomBody);
    res.status(201).json(city);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update city type by id
// @Route: /api/v1/cities/:id
// @Access: Private
exports.updateCity = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const citySearch = await City.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const city = citySearch[0];
    if (!city) {
      return res.status(404).json({ message: "city not found !" });
    }

    const updated = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete city type by id
// @Route: /api/v1/cities/:id
// @Access: Private
exports.deleteCity = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    const citySearch = await City.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const city = citySearch[0];
    if (!city) return res.status(404).json({ message: `city not found !` });
    await City.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "city deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
