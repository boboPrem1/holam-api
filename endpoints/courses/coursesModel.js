const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
    },
    videos: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Video",
      required: true,
      default: [],
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: "000000000000000000000000",
    },
    learners: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
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
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  this.populate({
    path: "learners",
    select: "_id username firstname lastname role complete_name phone",
  });
  this.populate({
    path: "videos",
    select: "video thumbnail",
  });
  this.populate({
    path: "chat",
    select: "groupName user members groupPicture lastMessage",
  });
  next();
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
