const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000"
    },
    videos: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Video",
      required: true,
      default: [],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "creator",
    select: "_id role",
  });
  this.populate({
    path: "videos",
    select: "video thumbnail",
  });
  next();
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
