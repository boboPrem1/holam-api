const mongoose = require("mongoose");

const geolocationServiceTransactionSchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeolocationServiceClient",
      default: "000000000000000000000000",
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeolocationServiceAgent",
      default: "000000000000000000000000",
      required: true,
    },
    paymentMean: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMean",
      default: "000000000000000000000000",
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
geolocationServiceTransactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "client",
    select: "user",
  });
  this.populate({
    path: "agent",
    select: "master user otp",
  });
  this.populate({
    path: "paymentMean",
    select: "name image",
  });
  next();
});

const GeolocationServiceTransaction = mongoose.model(
  "GeolocationServiceTransaction",
  geolocationServiceTransactionSchema
);
module.exports = GeolocationServiceTransaction;
