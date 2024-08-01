const mongoose = require("mongoose");

const monitoringSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: 'User',
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
    select: "_id role username",
  });
  next();
});

const Monitoring = mongoose.model("Monitoring", monitoringSchema);
module.exports = Monitoring;
