const mongoose = require("mongoose");

const countrySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    flag: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// populate response with user
// countrySchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "_id username slug",
//   });
//   next();
// });

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
