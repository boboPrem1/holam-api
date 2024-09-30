const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    fedaPaymentRef: {
      type: String,
      default: "",
    },
    fedaPaymentId: {
      type: String,
      default: "",
    },
    paymentUrl: {
      type: String,
      default: "",
    },
    paymentToken: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    paymentMean: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMean",
      default: "000000000000000000000000",
    },
    type: {
      type: String,
      enum: ["deposit", "video_paid", "course_paid"],
      default: "deposit",
    },
    status: {
      type: String,
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
    videoPaid: {
      type: mongoose.Schema.Types.ObjectId,
      default: "000000000000000000000000",
      ref: "Video",
    },
    coursePaid: {
      type: mongoose.Schema.Types.ObjectId,
      default: "000000000000000000000000",
      ref: "Course",
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "XOF",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name",
  });
  this.populate({
    path: "videoPaid",
    select: "description video thumbnail",
  });
  this.populate({
    path: "coursePaid",
    select: "title creator",
  });
  this.populate({
    path: "paymentMean",
    select: "name image",
  });
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
