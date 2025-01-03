const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      default: "000000000000000000000000",
    },
    path: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: {
      type: String,
    },
    name: {
      type: String,
    },
    key: {
      type: String,
    },
    key: {
      file: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
fileSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  next();
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
