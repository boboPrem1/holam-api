const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    isGroupChat: { type: Boolean, default: false, required: true },
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
    select: "_id role",
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
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
