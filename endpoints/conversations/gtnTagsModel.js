const mongoose = require("mongoose");

const gtnTagSchema = mongoose.Schema(
  {
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

const GtnTag = mongoose.model("GtnTag", gtnTagSchema);
module.exports = GtnTag;
