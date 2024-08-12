const Country = require("./countriesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all countries types
// @Route: /api/v1/countries
// @Access: Public
exports.getAllCountries = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
  try {
    const countries = await Country.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(countries);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get country type by id
// @Route: /api/v1/country/:id
// @Access: Public
exports.getCountryById = async (req, res) => {
  try {
    // get country type by id
    const userIn = await req.userIn();

    const countrySearch = await Country.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const country = countrySearch[0];
    if (!country)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new country type
// @Route: /api/v1/country
// @Access: Private
exports.createCountry = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    // create new country type
    const country = await Country.create(CustomBody);
    res.status(201).json(country);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update country type by id
// @Route: /api/v1/country/:id
// @Access: Private
exports.updateCountry = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const countrySearch = await Country.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const country = countrySearch[0];
    if (!country) {
      return res.status(404).json({ message: "country not found !" });
    }

    const updated = await Country.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete country type by id
// @Route: /api/v1/country/:id
// @Access: Private
exports.deleteCountry = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    const countrySearch = await Country.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const country = countrySearch[0];
    if (!country)
      return res.status(404).json({ message: `country not found !` });
    await Country.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "country deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
