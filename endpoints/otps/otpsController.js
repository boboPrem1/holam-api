const Otp = require("./otpsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all otp types
// @Route: /api/v1/otp
// @Access: Public
exports.getAllOtps = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  const userIn = await req.userIn();
  if (
    !userIn.role.slug === "super-administrateur" ||
    !userIn.role.slug === "admin"
  ) {
    queryObj.user = userIn._id;
  }
  try {
    const Otps = await Otp.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(Otps);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get otp type by id
// @Route: /api/v1/otp/:id
// @Access: Public
exports.getOtpById = async (req, res) => {
  try {
    // get otp type by id
    const userIn = await req.userIn();

    let otpSearch = await Otp.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      otpSearch = await Otp.find({
        _id: {
          $eq: req.params.id,
        },
      });
    }
    const otp = otpSearch[0];
    if (!otp)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(otp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new otp type
// @Route: /api/v1/otp
// @Access: Private
exports.createOtp = async (req, res) => {
  const userConnected = req.user;
  // const CustomBody = { ...req.body };
  // const slug = CustomUtils.slugify(CustomBody.name);
  const userIn = await req.userIn();
  try {
    // CustomBody.slug = slug;
    // // create new otp type
    // const otp = await Otp.create(CustomBody);

    let randomNumber = CustomUtils.getRandomNbr();
    let existingOtp = await Otp.find({
      otp: { $eq: randomNumber },
    });
    const beginningDate = new Date();
    const endingDate = new Date(beginningDate);
    endingDate.setDate(beginningDate.getDate() + 10);

    while (existingOtp.length) {
      randomNumber = CustomUtils.getRandomNbr();
      existingOtp = await Otp.find({
        otp: { $eq: randomNumber },
      });
    }
    const otp = await Otp.create({
      user: userIn._id,
      otp: randomNumber,
      exp: endingDate,
    });
    res.status(201).json(otp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update otp type by id
// @Route: /api/v1/otp/:id
// @Access: Private
exports.updateOtp = async (req, res) => {
  try {
    const userIn = await req.userIn();

    let otpSearch = await Otp.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      otpSearch = await Otp.find({
        _id: {
          $eq: req.params.id,
        },
      });
    }
    const otp = otpSearch[0];
    if (!otp) {
      return res.status(404).json({ message: "otp not found !" });
    }

    const updated = await Otp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete otp type by id
// @Route: /api/v1/otp/:id
// @Access: Private
exports.deleteOtp = async (req, res, next) => {
  try {
    const userIn = await req.userIn();

    let otpSearch = await Otp.find({
      _id: {
        $eq: req.params.id,
      },
      user: {
        $eq: userIn._id,
      },
    });
    if (
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin"
    ) {
      otpSearch = await Otp.find({
        _id: {
          $eq: req.params.id,
        },
      });
    }
    const otp = otpSearch[0];
    if (!otp) return res.status(404).json({ message: `otp not found !` });
    await Otp.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "otp deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
