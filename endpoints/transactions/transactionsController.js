const Transaction = require("./transactionsModel.js");
const CustomUtils = require("../../utils/index.js");
const axios = require("axios");
const {
  FedaPay,
  Transaction: FedaPayTransaction,
  Balance,
} = require("fedapay");
const User = require("../users/userModel.js");
require("dotenv").config();

const ENV = process.env.ENV;
const FEDA_API_SECRET = process.env.FEDA_PAY_API_SECRET;
FedaPay.setApiKey(FEDA_API_SECRET);
FedaPay.setEnvironment("live");

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
    const user = await req.userIn();
    // get transaction by id
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({
        message: CustomUtils.consts.NOT_FOUND,
      });
    const fedaPayTransaction = await FedaPayTransaction.retrieve(
      transaction.fedaPaymentId
    );

    // return res.status(200).json(fedaPayTransaction);
    if (transaction.status === "pending" || transaction.status === "approved") {
      if (fedaPayTransaction.status === "approved") {
        if (fedaPayTransaction.description === "deposit") {
          await User.findByIdAndUpdate(
            user._id,
            {
              balance: user.balance + fedaPayTransaction.amount_transferred,
            },
            {
              runValidators: true,
              new: true,
            }
          );

          transaction = await Transaction.findByIdAndUpdate(
            transaction._id,
            {
              status: "Processed deposit at " + fedaPayTransaction.approved_at,
              paidAt: fedaPayTransaction.approved_at,
            },
            {
              runValidators: true,
              new: true,
            }
          );
        } else {
          await User.findByIdAndUpdate(
            user._id,
            {
              balance: user.balance - fedaPayTransaction.amount_transferred,
            },
            {
              runValidators: true,
              new: true,
            }
          );

          transaction = await Transaction.findByIdAndUpdate(
            transaction._id,
            {
              status: "Processed payment at " + fedaPayTransaction.approved_at,
              paidAt: fedaPayTransaction.approved_at,
            },
            {
              runValidators: true,
              new: true,
            }
          );
        }
      } else {
        transaction = await Transaction.findByIdAndUpdate(
          transaction._id,
          {
            status: fedaPayTransaction.status,
          },
          {
            runValidators: true,
            new: true,
          }
        );
      }
    }

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
  let paymentPayload = {};
  // const slug = CustomUtils.slugify(CustomBody.name);
  const user = await req.userIn();
  if (!user.firstname || !user.lastname || !user.email || !user.phone.number)
    return res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  if (user.fedaPayCustomerId) {
    paymentPayload.customer = {
      id: user.fedaPayCustomerId,
    };
  } else {
    paymentPayload.customer = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone_number: {
        number: user.phone.number,
        country: "TG",
      },
    };
  }
  paymentPayload.amount = CustomBody.amount;
  paymentPayload.description = CustomBody.type;
  paymentPayload.currency = {
    iso: "XOF",
  };
  paymentPayload.callback_url = CustomBody.callback;

  try {
    const fedaPayTransaction = await FedaPayTransaction.create(paymentPayload);
    const token = await fedaPayTransaction.generateToken();
    // return redirect(token.url);
    // res.status(201).json({ transaction: fedaPayTransaction, token: token });
    // CustomBody.slug = slug;
    // create new transaction
    CustomBody.status = fedaPayTransaction.status;
    CustomBody.fedaPaymentRef = fedaPayTransaction.reference;
    CustomBody.fedaPaymentId = fedaPayTransaction.id;
    CustomBody.paymentUrl = token.url;
    CustomBody.paymentToken = token.token;
    CustomBody.user = user;

    if (!user.fedaPayCustomerId) {
      await User.findByIdAndUpdate(
        user._id,
        {
          fedaPayCustomerId: fedaPayTransaction.customer_id,
        },
        {
          runValidators: true,
          new: true,
        }
      );
    }
    const transaction = await Transaction.create(CustomBody);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const updated = await Transaction.findByIdAndUpdate(
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

// @Delete transaction by id
// @Route: /api/v1/transactions/:id
// @Access: Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: `transaction not found !` });
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "transaction deleted successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.paymentCallback = async (req, res, next) => {
  const { limit, page, sort, fields } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  try {
    console.log({ ...queryObj });
    res.status(200).json({ ...queryObj });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
