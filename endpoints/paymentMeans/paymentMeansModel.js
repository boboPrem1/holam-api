const mongoose = require("mongoose");

const paymentMeanSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: ""
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      default: "000000000000000000000000",
      ref: "File"
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
paymentMeanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "image",
    select: "path",
  });
  next();
});

const PaymentMean = mongoose.model("PaymentMean", paymentMeanSchema);
module.exports = PaymentMean;
