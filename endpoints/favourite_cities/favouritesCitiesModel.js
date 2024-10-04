const mongoose = require("mongoose");

const favouriteCitySchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    name: {
      type: String,
      required: true,
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
favouriteCitySchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  next();
});

const FavouriteCity = mongoose.model("FavouriteCity", favouriteCitySchema);
module.exports = FavouriteCity;
