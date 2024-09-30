const mongoose = require("mongoose");

const gtnTagSchema = mongoose.Schema(
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

gtnTagSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name",
  });
  next();
});

const GtnTag = mongoose.model("GtnTag", gtnTagSchema);
module.exports = GtnTag;
