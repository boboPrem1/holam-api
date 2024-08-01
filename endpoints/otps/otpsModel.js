const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
    },
    otp: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    exp: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["unused", "used", "expired"],
      default: "unused",
    },
    attempt: {
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
otpSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id role username",
  });
  next();
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
