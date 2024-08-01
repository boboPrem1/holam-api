const mongoose = require("mongoose");

const userTypeSchema = mongoose.Schema(
  {
    name: { type: String, default: "", required: true, unique: true },
    slug: { type: String, default: "", required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserType = mongoose.model("UserType", userTypeSchema);
module.exports = UserType;
