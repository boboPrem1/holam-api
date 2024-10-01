const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
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
    select: "_id username firstname lastname role complete_name phone",
  });
  next();
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
