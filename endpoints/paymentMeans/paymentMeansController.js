const PaymentMean = require("./paymentMeansModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all paymentMeans
// @Route: /api/v1/paymentMeans
// @Access: Public
exports.getAllPaymentMeans = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const paymentMeans = await PaymentMean.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(paymentMeans);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get paymentMean by id
// @Route: /api/v1/paymentMeans/:id
// @Access: Public
exports.getPaymentMeanById = async (req, res) => {
  try {
    // get paymentMean by id
    const paymentMean = await PaymentMean.findById(req.params.id);
    if (!paymentMean)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(paymentMean);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new paymentMean
// @Route: /api/v1/paymentMeans
// @Access: Private
exports.createPaymentMean = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new paymentMean     
    const paymentMean = await PaymentMean.create(CustomBody);
    res.status(201).json(paymentMean);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update paymentMean by id
// @Route: /api/v1/paymentMeans/:id
// @Access: Private
exports.updatePaymentMean = async (req, res) => {
  try {
    const paymentMean = await PaymentMean.findById(req.params.id);
    if (!paymentMean) {
      return res.status(404).json({ message: "paymentMean not found !" });
    }

    const updated = await PaymentMean.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete paymentMean by id
// @Route: /api/v1/paymentMeans/:id
// @Access: Private
exports.deletePaymentMean = async (req, res, next) => {
  try {
    const paymentMean = await PaymentMean.findById(req.params.id);
    if (!paymentMean) return res.status(404).json({ message: `paymentMean not found !` });
    await PaymentMean.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "paymentMean deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
