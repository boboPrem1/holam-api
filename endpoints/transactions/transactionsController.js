// const Transaction = require("./transactionsModel.js");
// const CustomUtils = require("../../utils/index.js");
// const axios = require("axios");
// const {
//   FedaPay,
//   Transaction: FedaPayTransaction,
//   Balance,
// } = require("fedapay");
// const User = require("../users/userModel.js");
// require("dotenv").config();

// const ENV = process.env.ENV;
// const FEDA_API_SECRET = process.env.FEDA_PAY_API_SECRET;
// FedaPay.setApiKey(FEDA_API_SECRET);
// FedaPay.setEnvironment("live");

// // @Get all transaction
// // @Route: /api/v1/transactions
// // @Access: Public
// exports.getAllTransactions = async (req, res, next) => {
//   let { limit, page, sort, fields, _from } = req.query;
//   const queryObj = CustomUtils.advancedQuery(req.query);
//   const userIn = await req.userIn();
//   if (
//     !userIn.role.slug == "super-administrateur" ||
//     !userIn.role.slug == "admin"
//   ) {
//     queryObj.user = userIn._id;
//   }
//   try {
//     const transactions = await Transaction.find(queryObj)
//       .limit(limit)
//       .sort({
//         createdAt: -1,
//         ...sort,
//       })
//       .select(fields);
//     res.status(200).json(transactions);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

// // @Get transaction by id
// // @Route: /api/v1/transactions/:id
// // @Access: Public
// exports.getTransactionById = async (req, res) => {
//   try {
//     const user = await req.userIn();
//     // get transaction by id
//     const userIn = await req.userIn();

//     let transactionSearch = await Transaction.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       transactionSearch = await Transaction.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const transaction = transactionSearch[0];
//     if (!transaction)
//       return res.status(404).json({
//         message: CustomUtils.consts.NOT_FOUND,
//       });
//     const fedaPayTransaction = await FedaPayTransaction.retrieve(
//       transaction.fedaPaymentId
//     );

//     // return res.status(200).json(fedaPayTransaction);
//     if (transaction.status === "pending" || transaction.status === "approved") {
//       if (fedaPayTransaction.status === "approved") {
//         if (fedaPayTransaction.description === "deposit") {
//           await User.findByIdAndUpdate(
//             user._id,
//             {
//               balance: user.balance + fedaPayTransaction.amount_transferred,
//             },
//             {
//               runValidators: true,
//               new: true,
//             }
//           );

//           transaction = await Transaction.findByIdAndUpdate(
//             transaction._id,
//             {
//               status: "Processed deposit at " + fedaPayTransaction.approved_at,
//               paidAt: fedaPayTransaction.approved_at,
//             },
//             {
//               runValidators: true,
//               new: true,
//             }
//           );
//         } else {
//           await User.findByIdAndUpdate(
//             user._id,
//             {
//               balance: user.balance - fedaPayTransaction.amount_transferred,
//             },
//             {
//               runValidators: true,
//               new: true,
//             }
//           );

//           transaction = await Transaction.findByIdAndUpdate(
//             transaction._id,
//             {
//               status: "Processed payment at " + fedaPayTransaction.approved_at,
//               paidAt: fedaPayTransaction.approved_at,
//             },
//             {
//               runValidators: true,
//               new: true,
//             }
//           );
//         }
//       } else {
//         transaction = await Transaction.findByIdAndUpdate(
//           transaction._id,
//           {
//             status: fedaPayTransaction.status,
//           },
//           {
//             runValidators: true,
//             new: true,
//           }
//         );
//       }
//     }

//     res.status(200).json(transaction);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Create new transaction
// // @Route: /api/v1/transactions
// // @Access: Private
// exports.createTransaction = async (req, res) => {
//   const CustomBody = { ...req.body };
//   let paymentPayload = {};
//   // const slug = CustomUtils.slugify(CustomBody.name);
//   const user = await req.userIn();
//   if (!user.firstname || !user.lastname || !user.email || !user.phone.number)
//     return res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
//   if (user.fedaPayCustomerId) {
//     paymentPayload.customer = {
//       id: user.fedaPayCustomerId,
//     };
//   } else {
//     paymentPayload.customer = {
//       firstname: user.firstname,
//       lastname: user.lastname,
//       email: user.email,
//       phone_number: {
//         number: user.phone.number,
//         country: "TG",
//       },
//     };
//   }
//   paymentPayload.amount = CustomBody.amount;
//   paymentPayload.description = CustomBody.type;
//   paymentPayload.currency = {
//     iso: "XOF",
//   };
//   paymentPayload.callback_url = CustomBody.callback;

//   try {
//     const fedaPayTransaction = await FedaPayTransaction.create(paymentPayload);
//     const token = await fedaPayTransaction.generateToken();
//     // return redirect(token.url);
//     // res.status(201).json({ transaction: fedaPayTransaction, token: token });
//     // CustomBody.slug = slug;
//     // create new transaction
//     CustomBody.status = fedaPayTransaction.status;
//     CustomBody.fedaPaymentRef = fedaPayTransaction.reference;
//     CustomBody.fedaPaymentId = fedaPayTransaction.id;
//     CustomBody.paymentUrl = token.url;
//     CustomBody.paymentToken = token.token;
//     CustomBody.user = user;

//     if (!user.fedaPayCustomerId) {
//       await User.findByIdAndUpdate(
//         user._id,
//         {
//           fedaPayCustomerId: fedaPayTransaction.customer_id,
//         },
//         {
//           runValidators: true,
//           new: true,
//         }
//       );
//     }
//     const transaction = await Transaction.create(CustomBody);
//     res.status(201).json(transaction);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Update transaction by id
// // @Route: /api/v1/transactions/:id
// // @Access: Private
// exports.updateTransaction = async (req, res) => {
//   try {
//     const userIn = await req.userIn();

//     let transactionSearch = await Transaction.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       transactionSearch = await Transaction.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const transaction = transactionSearch[0];
//     if (!transaction) {
//       return res.status(404).json({ message: "transaction not found !" });
//     }

//     const updated = await Transaction.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       }
//     );
//     return res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @Delete transaction by id
// // @Route: /api/v1/transactions/:id
// // @Access: Private
// exports.deleteTransaction = async (req, res, next) => {
//   try {
//     const userIn = await req.userIn();

//     let transactionSearch = await Transaction.find({
//       _id: {
//         $eq: req.params.id,
//       },
//       user: {
//         $eq: userIn._id,
//       },
//     });
//     if (
//       userIn.role.slug == "super-administrateur" ||
//       userIn.role.slug == "admin"
//     ) {
//       transactionSearch = await Transaction.find({
//         _id: {
//           $eq: req.params.id,
//         },
//       });
//     }
//     const transaction = transactionSearch[0];
//     if (!transaction)
//       return res.status(404).json({ message: `transaction not found !` });
//     await Transaction.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "transaction deleted successfully !" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.paymentCallback = async (req, res, next) => {
//   let { limit, page, sort, fields, _from } = req.query;
//   const queryObj = CustomUtils.advancedQuery(req.query);
//   try {
//     console.log({ ...queryObj });
//     res.status(200).json({ ...queryObj });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

const Transaction = require("./transactionsModel.js");
const CustomUtils = require("../../utils/index.js");
const axios = require("axios");
const {
  FedaPay,
  Transaction: FedaPayTransaction,
  Balance,
} = require("fedapay");
const User = require("../users/userModel.js");
const Video = require("../videos/videosModel.js");
const Course = require("../courses/coursesModel.js");
const Chat = require("../chats/chatsModel.js");
require("dotenv").config();

const FEDA_API_SECRET = process.env.FEDA_PAY_API_SECRET;
FedaPay.setApiKey(FEDA_API_SECRET);
FedaPay.setEnvironment("live");

// @Get all transactions
// @Route: /api/v1/transactions
// @Access: Public
exports.getAllTransactions = async (req, res) => {
  try {
    let { limit, page, sort, fields, _from } = req.query;
    limit = parseInt(limit, 10);
    let skip = null;
    if (_from) limit = null;
    const queryObj = CustomUtils.advancedQuery(req.query);
    const userIn = await req.userIn();

    // Restrict query for non-admin users
    if (
      userIn.role.slug !== "super-administrateur" &&
      userIn.role.slug !== "admin"
    ) {
      queryObj.user = userIn._id;
    }

    const transactions = await Transaction.find(queryObj)
      .limit(Number(limit) || 10)
      .sort(sort ? sort : { createdAt: -1 })
      .select(fields);

    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};

// @Get transaction by id
// @Route: /api/v1/transactions/:id
// @Access: Public
exports.getTransactionById = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const isAdmin =
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin";

    let transactionSearch = await Transaction.find({
      _id: req.params.id,
      ...(isAdmin ? {} : { user: userIn._id }),
    });

    if (!transactionSearch.length) {
      return res.status(404).json({ message: CustomUtils.consts.NOT_FOUND });
    }

    let transaction = transactionSearch[0];
    const fedaPayTransaction = await FedaPayTransaction.retrieve(
      transaction.fedaPaymentId
    );

    if (transaction.status === "pending" || transaction.status === "approved") {
      transaction = await handleFedaPayTransaction(
        transaction,
        fedaPayTransaction,
        userIn
      );
    }

    res.status(200).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transaction", error: error.message });
  }
};

// Helper function to handle FedaPay transaction
async function handleFedaPayTransaction(transaction, fedaPayTransaction, user) {
  const userIn = user;
  if (fedaPayTransaction.status === "approved") {
    let amount = fedaPayTransaction.amount_transferred;
    const updateBalance =
      fedaPayTransaction.description === "deposit" ? amount : (amount = 0);

    if (fedaPayTransaction.description === "video_paid") {
      await Video.findByIdAndUpdate(transaction.videoInPaid, {
        $push: {
          paidBy: userIn._id,
        },
      });
    }
    if (fedaPayTransaction.description === "course_paid") {
      const course = await Course.findByIdAndUpdate(transaction.courseInPaid, {
        $push: {
          learners: userIn._id,
        },
      });

      await Chat.findByIdAndUpdate(course.chat, {
        $push: {
          members: userIn._id,
        },
      });
    }
    if (amount)
      await User.findByIdAndUpdate(
        user._id,
        { $inc: { balance: updateBalance } },
        { new: true }
      );

    transaction = await Transaction.findByIdAndUpdate(
      transaction._id,
      {
        status: `Processed ${fedaPayTransaction.description} at ${fedaPayTransaction.approved_at}`,
        paidAt: fedaPayTransaction.approved_at,
      },
      { new: true }
    );
  } else {
    transaction = await Transaction.findByIdAndUpdate(
      transaction._id,
      { status: fedaPayTransaction.status },
      { new: true }
    );
  }

  return transaction;
}

// @Create new transaction
// @Route: /api/v1/transactions
// @Access: Private
exports.createTransaction = async (req, res) => {
  const CustomBody = { ...req.body };
  const user = await req.userIn();

  if (!user.firstname || !user.lastname || !user.email || !user.phone?.number) {
    return res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });
  }

  if (
    CustomBody.type === "deposit" &&
    (!CustomBody.amount || !CustomBody.amount < 100)
  ) {
    return res.status(400).json({
      message: CustomUtils.consts.MISSING_DATA,
    });
  }

  try {
    
  if (CustomBody.type === "video_paid") {
    const videoInPaid = await Video.findById(CustomBody.video);

    if (!videoInPaid)
      return res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });

    CustomBody.amount = videoInPaid.price;
    CustomBody.videoInPaid = videoInPaid._id;
  }

  if (CustomBody.type === "course_paid") {
    const courseInPaid = await Course.findById(CustomBody.course);

    if (!courseInPaid)
      return res.status(400).json({ message: CustomUtils.consts.MISSING_DATA });

    CustomBody.amount = courseInPaid.price;
    CustomBody.courseInPaid = courseInPaid._id;
  }

  const paymentPayload = createPaymentPayload(CustomBody, user);

    const fedaPayTransaction = await FedaPayTransaction.create(paymentPayload);
    const token = await fedaPayTransaction.generateToken();

    CustomBody.status = fedaPayTransaction.status;
    CustomBody.fedaPaymentRef = fedaPayTransaction.reference;
    CustomBody.fedaPaymentId = fedaPayTransaction.id;
    CustomBody.paymentUrl = token.url;
    CustomBody.paymentToken = token.token;
    CustomBody.user = user._id;

    if (!user.fedaPayCustomerId) {
      await User.findByIdAndUpdate(user._id, {
        fedaPayCustomerId: fedaPayTransaction.customer_id,
      });
    }

    const transaction = await Transaction.create(CustomBody);
    res.status(201).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

exports.createBalanceTransaction = async (req, res) => {
  const CustomBody = { ...req.body };
  const user = await req.userIn();

  if (CustomBody.amount && !CustomBody.amount < user.balance) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  try {
    if (CustomBody.type === "video_paid") {
      const videoInPaid = await Video.findById(CustomBody.video);

      if (!videoInPaid)
        return res
          .status(400)
          .json({ message: CustomUtils.consts.MISSING_DATA });

      CustomBody.amount = videoInPaid.price;
      CustomBody.videoInPaid = videoInPaid._id;
      await Video.findByIdAndUpdate(videoInPaid._id, {
        $push: {
          paidBy: user._id,
        },
      });

      CustomBody.user = user._id;
      const nownow = new Date();
      CustomBody.status = `Processed at ${nownow.toLocaleString("fr-FR", {
        timeZone: "UTC",
      })}`;
      const transaction = await Transaction.create(CustomBody);
      return res.status(201).json(transaction);
    }

    if (CustomBody.type === "course_paid") {
      const courseInPaid = await Course.findById(CustomBody.course);

      if (!courseInPaid)
        return res
          .status(400)
          .json({ message: CustomUtils.consts.MISSING_DATA });

      CustomBody.amount = courseInPaid.price;
      CustomBody.courseInPaid = courseInPaid._id;

      const course = await Course.findByIdAndUpdate(courseInPaid._id, {
        $push: {
          learners: user._id,
        },
      });

      await Chat.findByIdAndUpdate(course.chat, {
        $push: {
          members: user._id,
        },
      });

      CustomBody.user = user._id;
      const nownownow = new Date();
      CustomBody.status = `Processed at ${nownownow.toLocaleString("fr-FR", {
        timeZone: "UTC",
      })}`;

      const transaction = await Transaction.create(CustomBody);
      return res.status(201).json(transaction);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

// Helper function to create payment payload
function createPaymentPayload(CustomBody, user) {
  const paymentPayload = {
    amount: CustomBody.amount,
    description: CustomBody.type,
    currency: { iso: "XOF" },
    callback_url: CustomBody.callback,
    customer: user.fedaPayCustomerId
      ? { id: user.fedaPayCustomerId }
      : {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone_number: {
            number: user.phone.number,
            country: "TG",
          },
        },
  };
  return paymentPayload;
}

exports.depositTransaction = async (req, res) => {
  const CustomBody = { ...req.body };
  const user = await req.userIn();

  if (!user.firstname || !user.lastname || !user.email || !user.phone?.number) {
    return res.status(400).json({
      message:
        "You must update your personnal informations in order to do transactions on HOLAM",
    });
  }

  if (!CustomBody.amount || !CustomBody.amount < 100) {
    return res.status(400).json({
      message: CustomUtils.consts.MISSING_DATA,
    });
  }

  const paymentPayload = createPaymentPayload(CustomBody, user);

  try {
    const fedaPayTransaction = await FedaPayTransaction.create(paymentPayload);
    const token = await fedaPayTransaction.generateToken();

    CustomBody.type = "deposit";
    CustomBody.status = fedaPayTransaction.status;
    CustomBody.fedaPaymentRef = fedaPayTransaction.reference;
    CustomBody.fedaPaymentId = fedaPayTransaction.id;
    CustomBody.paymentUrl = token.url;
    CustomBody.paymentToken = token.token;
    CustomBody.user = user._id;

    if (!user.fedaPayCustomerId) {
      await User.findByIdAndUpdate(user._id, {
        fedaPayCustomerId: fedaPayTransaction.customer_id,
      });
    }

    const transaction = await Transaction.create(CustomBody);
    res.status(201).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

exports.videoPaidTransaction = async (req, res) => {
  const CustomBody = { ...req.body };
  const user = await req.userIn();

  if (!user.firstname || !user.lastname || !user.email || !user.phone?.number) {
    return res.status(400).json({
      message:
        "You must update your personnal informations in order to do transactions on HOLAM",
    });
  }

  if (
    !CustomBody.amount ||
    !CustomBody.amount < 100 ||
    !CustomBody.video_paid
  ) {
    return res.status(400).json({
      message: CustomUtils.consts.MISSING_DATA,
    });
  }

  const paymentPayload = createPaymentPayload(CustomBody, user);

  try {
    const fedaPayTransaction = await FedaPayTransaction.create(paymentPayload);
    const token = await fedaPayTransaction.generateToken();

    CustomBody.type = "deposit";
    CustomBody.status = fedaPayTransaction.status;
    CustomBody.fedaPaymentRef = fedaPayTransaction.reference;
    CustomBody.fedaPaymentId = fedaPayTransaction.id;
    CustomBody.paymentUrl = token.url;
    CustomBody.paymentToken = token.token;
    CustomBody.user = user._id;

    if (!user.fedaPayCustomerId) {
      await User.findByIdAndUpdate(user._id, {
        fedaPayCustomerId: fedaPayTransaction.customer_id,
      });
    }

    const transaction = await Transaction.create(CustomBody);
    res.status(201).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

exports.coursePaidTransaction = async (req, res) => {
  const CustomBody = { ...req.body };
  const user = await req.userIn();

  if (!user.firstname || !user.lastname || !user.email || !user.phone?.number) {
    return res.status(400).json({
      message:
        "You must update your personnal informations in order to do transactions on HOLAM",
    });
  }

  if (
    !CustomBody.amount ||
    !CustomBody.amount < 100 ||
    !CustomBody.courseInPaid
  ) {
    return res.status(400).json({
      message: CustomUtils.consts.MISSING_DATA,
    });
  }

  const paymentPayload = createPaymentPayload(CustomBody, user);

  try {
    const fedaPayTransaction = await FedaPayTransaction.create(paymentPayload);
    const token = await fedaPayTransaction.generateToken();

    CustomBody.type = "deposit";
    CustomBody.status = fedaPayTransaction.status;
    CustomBody.fedaPaymentRef = fedaPayTransaction.reference;
    CustomBody.fedaPaymentId = fedaPayTransaction.id;
    CustomBody.paymentUrl = token.url;
    CustomBody.paymentToken = token.token;
    CustomBody.user = user._id;

    if (!user.fedaPayCustomerId) {
      await User.findByIdAndUpdate(user._id, {
        fedaPayCustomerId: fedaPayTransaction.customer_id,
      });
    }

    const transaction = await Transaction.create(CustomBody);
    res.status(201).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

exports.checkTransaction = async (req, res) => {
  try {
    const transaction_id = req.params.id;
  } catch (error) {}
};

// @Update transaction by id
// @Route: /api/v1/transactions/:id
// @Access: Private
exports.updateTransaction = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const isAdmin =
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin";

    let transactionSearch = await Transaction.find({
      _id: req.params.id,
      ...(isAdmin ? {} : { user: userIn._id }),
    });

    if (!transactionSearch.length) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating transaction", error: error.message });
  }
};

// @Delete transaction by id
// @Route: /api/v1/transactions/:id
// @Access: Private
exports.deleteTransaction = async (req, res) => {
  try {
    const userIn = await req.userIn();
    const isAdmin =
      userIn.role.slug === "super-administrateur" ||
      userIn.role.slug === "admin";

    const transactionSearch = await Transaction.find({
      _id: req.params.id,
      ...(isAdmin ? {} : { user: userIn._id }),
    });

    if (!transactionSearch.length) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting transaction", error: error.message });
  }
};

// @Handle payment callback
exports.paymentCallback = async (req, res) => {
  try {
    const queryObj = CustomUtils.advancedQuery(req.query);
    res.status(200).json(queryObj);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error handling callback", error: error.message });
  }
};
