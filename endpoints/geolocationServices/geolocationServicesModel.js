const mongoose = require("mongoose");

const geolocationServiceSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    name: { type: String, default: "", required: true, unique: true },
    slug: { type: String, default: "", required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

geolocationServiceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  next();
});

const GeolocationService = mongoose.model(
  "GeolocationService",
  geolocationServiceSchema
);
module.exports = GeolocationService;
