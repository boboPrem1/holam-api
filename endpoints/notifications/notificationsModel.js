const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
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
    select: "_id role username",
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
