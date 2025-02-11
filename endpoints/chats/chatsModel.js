const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    isGroupChat: { type: Boolean, default: true, required: true },
    groupName: { type: String },
    groupPicture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: "000000000000000000000000",
    },
    messages: { type: [mongoose.Schema.Types.ObjectId], ref: "Message" },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: "000000000000000000000000",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
chatSchema.pre(/^find/, function (next) {
  this.populate({
    path: "members",
    select: "_id username firstname lastname role complete_name phone",
  });
  this.populate({
    path: "groupPicture",
    select: "user path",
  });
  this.populate({
    path: "messages",
    select: "sender content",
  });
  this.populate({
    path: "lastMessage",
    select: "sender content",
  });
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
