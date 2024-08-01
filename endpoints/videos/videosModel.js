const mongoose = require("mongoose");

const videoSchema = mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
      default: "000000000000000000000000",
    },
    thumbnail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: "000000000000000000000000",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    tags: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tag",
      default: "000000000000000000000000",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: "000000000000000000000000",
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      default: "000000000000000000000000",
    },
    description: {
      type: String,
    },
    shares: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
videoSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id role username",
  });
  this.populate({
    path: "likes",
    select: "_id role",
  });
  this.populate({
    path: "video",
    select: "user path",
  });
  this.populate({
    path: "thumbnail",
    select: "user path",
  });
  this.populate({
    path: "tags",
    select: "name slug",
  });
  this.populate({
    path: "comments",
    select: "user content",
  });
  next();
});

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
