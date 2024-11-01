const mongoose = require("mongoose");

const caseSchema = mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    report: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

caseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name phone",
  });
  next();
});

const Case = mongoose.model("Case", caseSchema);
module.exports = Case;
