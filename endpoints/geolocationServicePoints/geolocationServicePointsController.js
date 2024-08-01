const GeolocationServicePoint = require("./geolocationServicePointsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all geolocationServicePoints
// @Route: /api/v1/geolocationServicePoints
// @Access: Public
exports.getAllGeolocationServicePoints = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const geolocationServicePoints = await GeolocationServicePoint.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(geolocationServicePoints);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get geolocationServicePoint by id
// @Route: /api/v1/geolocationServicePoints/:id
// @Access: Public
exports.getGeolocationServicePointById = async (req, res) => {
  try {
    // get geolocationServicePoint by id
    const geolocationServicePoint = await GeolocationServicePoint.findById(req.params.id);
    if (!geolocationServicePoint)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(geolocationServicePoint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new geolocationServicePoint
// @Route: /api/v1/geolocationServicePoints
// @Access: Private
exports.createGeolocationServicePoint = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new geolocationServicePoint     
    const geolocationServicePoint = await GeolocationServicePoint.create(CustomBody);
    res.status(201).json(geolocationServicePoint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update geolocationServicePoint by id
// @Route: /api/v1/geolocationServicePoints/:id
// @Access: Private
exports.updateGeolocationServicePoint = async (req, res) => {
  try {
    const geolocationServicePoint = await GeolocationServicePoint.findById(req.params.id);
    if (!geolocationServicePoint) {
      return res.status(404).json({ message: "geolocationServicePoint not found !" });
    }

    const updated = await GeolocationServicePoint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete geolocationServicePoint by id
// @Route: /api/v1/geolocationServicePoints/:id
// @Access: Private
exports.deleteGeolocationServicePoint = async (req, res, next) => {
  try {
    const geolocationServicePoint = await GeolocationServicePoint.findById(req.params.id);
    if (!geolocationServicePoint) return res.status(404).json({ message: `geolocationServicePoint not found !` });
    await GeolocationServicePoint.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "geolocationServicePoint deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
