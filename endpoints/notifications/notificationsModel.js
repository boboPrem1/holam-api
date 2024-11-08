const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "follow",
        "profil_viewed",
        "other",
        "transaction_operation",
        "geolocation_operation",
      ],
      default: "other",
      required: true,
    },
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      default: "000000000000000000000000",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
notificationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  this.populate({
    path: "initiator",
    select: "_id role",
  });
  this.populate({
    path: "video",
    select: "video thumbnail",
  });
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
