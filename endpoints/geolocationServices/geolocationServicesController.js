const GeolocationService = require("./geolocationServicesModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all event geolocationServices
// @route Get /api/v1/geolocationServices
// @access Public
exports.getAllGeolocationServices = async (req, res) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
  try {
    const geolocationServices = await GeolocationService.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(geolocationServices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get event geolocationService by id
// @route Get /api/v1/geolocationServices/:id
// @access Public
exports.getGeolocationServiceById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const geolocationServiceSearch = await GeolocationService.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const geolocationService = geolocationServiceSearch[0];
    if (!geolocationService)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    res.status(200).json(geolocationService);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Create new event geolocationService
// @route Post /api/v1/geolocationServices
// @access Public
exports.createGeolocationService = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    const newgeolocationService = await GeolocationService.create(CustomBody);
    res.status(201).json(newgeolocationService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update event geolocationService by id
// @route Patch /api/v1/geolocationServices/:id
// @access Public
exports.updateGeolocationServiceById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const geolocationServiceSearch = await ActivitySubCategory.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const geolocationService = geolocationServiceSearch[0];
    if (!geolocationService)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });

    const updated = await GeolocationService.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete event geolocationService by id
// @route Delete /api/v1/geolocationServices/:id
// @access Public
exports.deleteGeolocationServiceById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const geolocationServiceSearch = await ActivitySubCategory.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const geolocationService = geolocationServiceSearch[0];
    if (!geolocationService)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    await GeolocationService.findByIdAndDelete(req.params.id);
    return res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
