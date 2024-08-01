const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
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
      default: "",
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
    select: "_id role username",
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
