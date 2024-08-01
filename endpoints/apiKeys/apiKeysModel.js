const mongoose = require("mongoose");

const apiKeySchema = mongoose.Schema(
  {
    key: { type: String, default: "", required: true },
    application: { type: String, default: "", required: true },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      default: "000000000000000000000000",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

apiKeySchema.pre(/^find/, function (next) {
  this.populate({
    path: "permission",
    select: "code perms",
  });
  next();
});

const ApiKey = mongoose.model("ApiKey", apiKeySchema);
module.exports = ApiKey;
