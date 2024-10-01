const mongoose = require("mongoose");

const activitySubCategorySchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActivityCategory",
      default: "000000000000000000000000",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with userRole
activitySubCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "user slug name image",
  });
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  this.populate({
    path: "image",
    select: "user path",
  });
  next();
});

const ActivitySubCategory = mongoose.model(
  "ActivitySubCategory",
  activitySubCategorySchema
);
module.exports = ActivitySubCategory;
