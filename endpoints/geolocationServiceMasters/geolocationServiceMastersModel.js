const mongoose = require("mongoose");

const geolocationServiceMasterSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      default: "000000000000000000000000",
      ref: "User",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      default: "000000000000000000000000",
      ref: "GeolocationService",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
geolocationServiceMasterSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username firstname lastname role",
  });
  this.populate({
    path: "service",
    select: "name slug",
  });
  next();
});

const GeolocationServiceMaster = mongoose.model(
  "GeolocationServiceMaster",
  geolocationServiceMasterSchema
);
module.exports = GeolocationServiceMaster;
