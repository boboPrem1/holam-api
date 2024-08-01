const mongoose = require("mongoose");

const geolocationServiceSchema = mongoose.Schema(
  {
    name: { type: String, default: "", required: true, unique: true },
    slug: { type: String, default: "", required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const GeolocationService = mongoose.model("GeolocationService", geolocationServiceSchema);
module.exports = GeolocationService;
