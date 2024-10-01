const mongoose = require("mongoose");

const activitySchema = mongoose.Schema(
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
    type: {
      type: String,
      enum: ["suggestion", "reporting"],
      default: "suggestion",
    },
    description: {
      type: String,
    },
    subCategories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ActivitySubCategory",
      default: "000000000000000000000000",
    },
    categorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActivityCategory",
      default: "000000000000000000000000",
    },
    images: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "File",
      default: "000000000000000000000000",
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with userRole
activitySchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  this.populate({
    path: "categorie",
    select: "user name slug image",
  });
  this.populate({
    path: "subCategories",
    select: "user name slug image",
  });
  this.populate({
    path: "images",
    select: "user path",
  });
  next();
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
