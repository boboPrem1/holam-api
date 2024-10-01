const mongoose = require("mongoose");

const monitoringSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

monitoringSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  next();
});

const Monitoring = mongoose.model("Monitoring", monitoringSchema);
module.exports = Monitoring;
