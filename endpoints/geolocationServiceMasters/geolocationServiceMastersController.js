const GeolocationServiceMaster = require("./geolocationServiceMastersModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all event geolocationServiceMasters
// @route Get /api/v1/geolocationServiceMasters
// @access Public
exports.getAllGeolocationServiceMasters = async (req, res) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const geolocationServiceMasters = await GeolocationServiceMaster.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(geolocationServiceMasters);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get event geolocationServiceMaster by id
// @route Get /api/v1/geolocationServiceMasters/:id
// @access Public
exports.getGeolocationServiceMasterById = async (req, res) => {
  try {
    const geolocationServiceMaster = await GeolocationServiceMaster.findById(req.params.id);
    if (!geolocationServiceMaster)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    res.status(200).json(geolocationServiceMaster);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Create new event geolocationServiceMaster
// @route Post /api/v1/geolocationServiceMasters
// @access Public
exports.createGeolocationServiceMaster = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    const newgeolocationServiceMaster = await GeolocationServiceMaster.create(CustomBody);
    res.status(201).json(newgeolocationServiceMaster);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update event geolocationServiceMaster by id
// @route Patch /api/v1/geolocationServiceMasters/:id
// @access Public
exports.updateGeolocationServiceMasterById = async (req, res) => {
  try {
    const geolocationServiceMaster = await GeolocationServiceMaster.findById(req.params.id);
    if (!geolocationServiceMaster)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });

    const updated = await GeolocationServiceMaster.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete event geolocationServiceMaster by id
// @route Delete /api/v1/geolocationServiceMasters/:id
// @access Public
exports.deleteGeolocationServiceMasterById = async (req, res) => {
  try {
    const geolocationServiceMaster = await GeolocationServiceMaster.findById(req.params.id);
    if (!geolocationServiceMaster)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    await GeolocationServiceMaster.findByIdAndDelete(req.params.id);
    return res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
