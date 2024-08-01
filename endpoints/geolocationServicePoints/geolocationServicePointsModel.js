const mongoose = require("mongoose");

const geolocationServicePointSchema = mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeolocationServiceTransaction",
      default: "000000000000000000000000",
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
    description: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
geolocationServicePointSchema.pre(/^find/, function (next) {
  this.populate({
    path: "transaction",
    select: "amount",
  });
  next();
});

const GeolocationServicePoint = mongoose.model("GeolocationServicePoint", geolocationServicePointSchema);
module.exports = GeolocationServicePoint;
