const mongoose = require("mongoose");

const geolocationServiceAgentSchema = mongoose.Schema(
  {
    master: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeolocationServiceMaster",
      default: "000000000000000000000000",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
    },
    otp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Otp",
      default: "000000000000000000000000",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
geolocationServiceAgentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "master",
    select: "user service",
  });
  this.populate({
    path: "user",
    select: "username role",
  });
  this.populate({
    path: "otp",
    select: "otp",
  });
  next();
});

const GeolocationServiceAgent = mongoose.model("GeolocationServiceAgent", geolocationServiceAgentSchema);
module.exports = GeolocationServiceAgent;
