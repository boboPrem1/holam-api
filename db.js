const mongoose = require("mongoose");

const connection = (URL_CONNECT_DEV) => {
  mongoose
    .connect(URL_CONNECT_DEV)
    .then((connection) => {
      console.log("Database connection successful ...");
    })
    .catch((e) => {
      console.log("Something went wrong, Error: " + e);
    });
};

// Exclude sensibles and timestamps from response
mongoose.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.updatedAt;
    delete ret.password;
    return ret;
  },
});

// Export connection
module.exports = connection;
