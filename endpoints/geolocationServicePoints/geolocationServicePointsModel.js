const mongoose = require("mongoose");

const geolocationServicePointSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
    },
    master: {
      type: String,
      ref: "Master",
      default: "000000000000000000000000",
    },
    agent: {
      type: String,
      ref: "Agent",
      default: "000000000000000000000000",
    },
    client: {
      type: String,
      ref: "Client",
      default: "000000000000000000000000",
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    days: {
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
geolocationServicePointSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name",
  });
  next();
});

const GeolocationServicePoint = mongoose.model(
  "GeolocationServicePoint",
  geolocationServicePointSchema
);
module.exports = GeolocationServicePoint;
