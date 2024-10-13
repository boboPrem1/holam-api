const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: "000000000000000000000000",
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      default: "000000000000000000000000",
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  // this.populate({
  //   path: "video",
  //   select: "user path",
  // });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
