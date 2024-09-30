const mongoose = require("mongoose");

const userRoleSchema = mongoose.Schema(
  {
    name: { type: String, default: "", required: true, unique: true },
    slug: { type: String, default: "" },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      default: "000000000000000000000000",
    },
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with userRole
userRoleSchema.pre(/^find/, function (next) {
  this.populate({
    path: "permission",
    select: "code perms",
  });
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name",
  });
  next();
});

const UserRole = mongoose.model("UserRole", userRoleSchema);
module.exports = UserRole;
