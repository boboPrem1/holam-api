const mongoose = require("mongoose");

const citySchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      default: "000000000000000000000000",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
citySchema.pre(/^find/, function (next) {
  this.populate({
    path: "country",
    select: "_id name flag slug",
  });
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name",
  });
  next();
});

const City = mongoose.model("City", citySchema);
module.exports = City;
