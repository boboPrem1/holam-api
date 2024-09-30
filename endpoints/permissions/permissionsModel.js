const mongoose = require("mongoose");

const permissionSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    code: { type: String, default: "", required: true },
    perms: { type: Array, default: "", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

permissionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name",
  });
  next();
});

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
