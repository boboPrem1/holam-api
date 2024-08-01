const Transaction = require("./transactionsModel.js");
const CustomUtils = require("../../utils/index.js");

// @Get all transaction
// @Route: /api/v1/transactions
// @Access: Public
exports.getAllTransactions = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    const transactions = await Transaction.find(queryObj)
      .limit(limit * 1)
      .sort({
        createdAt: -1,
        ...sort,
      })
      .select(fields);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @Get transaction by id
// @Route: /api/v1/transactions/:id
// @Access: Public
exports.getTransactionById = async (req, res) => {
  try {
    // get transaction by id
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Create new transaction
// @Route: /api/v1/transactions
// @Access: Private
exports.createTransaction = async (req, res) => {
  const CustomBody = { ...req.body };
  const slug = CustomUtils.slugify(CustomBody.name);
  try {
    CustomBody.slug = slug;
    // create new transaction     
    const transaction = await Transaction.create(CustomBody);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @Update transaction by id
// @Route: /api/v1/transactions/:id
// @Access: Private
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "transaction not found !" });
    }

    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @Delete transaction by id
// @Route: /api/v1/transactions/:id
// @Access: Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: `transaction not found !` });
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "transaction deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
