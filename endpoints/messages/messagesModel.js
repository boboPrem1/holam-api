const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: "000000000000000000000000",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["text", "image", "video", "audio", "document"],
      default: "text",
      required: true,
    },
    attachments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "File",
      default: "000000000000000000000000",
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: "000000000000000000000000",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "chat",
    select: "groupName groupPicture",
  });
  this.populate({
    path: "sender",
    select: "username role",
  });
  this.populate({
    path: "user",
    select: "_id username firstname lastname role",
  });
  next();
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
