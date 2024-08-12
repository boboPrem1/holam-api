const GeolocationServiceClient = require("./geolocationServicesClientsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all event geolocationServiceClients
// @route Get /api/v1/geolocationServiceClients
// @access Public
exports.getAllGeolocationServiceClients = async (req, res) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  queryObj.user = userIn._id;
  try {
    const geolocationServiceClients = await GeolocationServiceClient.find(
      queryObj
    )
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(geolocationServiceClients);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get event geolocationServiceClient by id
// @route Get /api/v1/geolocationServiceClients/:id
// @access Public
exports.getGeolocationServiceClientById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const geolocationServiceClientSearch = await GeolocationServiceClient.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const geolocationServiceClient = geolocationServiceClientSearch[0];
    if (!geolocationServiceClient)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    res.status(200).json(geolocationServiceClient);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Create new event geolocationServiceClient
// @route Post /api/v1/geolocationServiceClients
// @access Public
exports.createGeolocationServiceClient = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);

  const userIn = await req.userIn();
  CustomBody.user = userIn._id;
  try {
    CustomBody.slug = slug;
    const newgeolocationServiceClient = await GeolocationServiceClient.create(
      CustomBody
    );
    res.status(201).json(newgeolocationServiceClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update event geolocationServiceClient by id
// @route Patch /api/v1/geolocationServiceClients/:id
// @access Public
exports.updateGeolocationServiceClientById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const geolocationServiceClientSearch = await GeolocationServiceClient.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const geolocationServiceClient = geolocationServiceClientSearch[0];
    if (!geolocationServiceClient)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });

    const updated = await GeolocationServiceClient.findByIdAndUpdate(
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

// @Delete event geolocationServiceClient by id
// @route Delete /api/v1/geolocationServiceClients/:id
// @access Public
exports.deleteGeolocationServiceClientById = async (req, res) => {
  try {
    const userIn = await req.userIn();

    const geolocationServiceClientSearch = await GeolocationServiceClient.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    const geolocationServiceClient = geolocationServiceClientSearch[0];
    if (!geolocationServiceClient)
      return res.status(404).json({ message: CustomUtils.consts.NOT_EXIST });
    await GeolocationServiceClient.findByIdAndDelete(req.params.id);
    return res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
