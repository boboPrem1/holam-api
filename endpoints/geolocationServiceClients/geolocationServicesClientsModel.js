const mongoose = require("mongoose");

const geolocationServiceClientSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      default: "000000000000000000000000",
      ref: "User",
    },
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: ""
    },
    master: {
      type: mongoose.Schema.Types.ObjectId,
      default: "000000000000000000000000",
      ref: "GeolocationServiceMaster",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
geolocationServiceClientSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username firstname lastname role",
  });
  this.populate({
    path: "master",
    select: "user service",
  });
  next();
});

const GeolocationServiceClient = mongoose.model(
  "GeolocationServiceClient",
  geolocationServiceClientSchema
);
module.exports = GeolocationServiceClient;
