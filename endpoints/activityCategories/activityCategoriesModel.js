const mongoose = require("mongoose");

const activityCategorySchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
      default: "000000000000000000000000",
    },
    slug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: "000000000000000000000000",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with userRole
activityCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role",
  });
  this.populate({
    path: "image",
    select: "user path",
  });
  next();
});

const ActivityCategory = mongoose.model(
  "ActivityCategory",
  activityCategorySchema
);
module.exports = ActivityCategory;
