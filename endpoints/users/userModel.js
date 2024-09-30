const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      default: "",
    },
    age: {
      type: String,
      default: "",
    },
    profession: {
      type: String,
      default: "",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    tags: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tag",
      default: [],
    },
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: "000000000000000000000000",
    },
    bio: {
      type: String,
      default: "",
    },
    balance: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      select: false,
      default: "",
    },
    passwordIsSet: {
      type: Boolean,
      default: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      default: "",
    },
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: "",
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRole",
      default: "000000000000000000000000",
    },
    gender: {
      type: String,
      enum: ["m", "f", "o"],
      default: "o",
    },
    phone: {
      type: {
        indicatif: { type: String },
        number: { type: String },
      },
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    address: {
      type: String,
      default: "",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: "000000000000000000000000",
    },
    complete_name: {
      type: String,
      default: "",
    },
    fedaPayCustomerId: {
      type: String,
      default: "",
    },
    user: {
      type: String,
      ref: "User",
      default: "000000000000000000000000",
    },
  },
  {
    timestamps: true,
  }
);

// populate response with userRole
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "role",
    select: "name slug",
  });
  this.populate({
    path: "avatar",
    select: "path",
  });
  this.populate({
    path: "created_by",
    select: "username",
  });
  this.populate({
    path: "user",
    select: "_id username firstname lastname role complete_name",
  });
  next();
});

// Hash password universal function
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

// Hash password and delete confirmPassword before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12
  this.password = await hashPassword(this.password);

  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

// Hash password and delete confirmPassword before updating or create
userSchema.pre("findOneAndUpdate", async function (next) {
  // Only run this function if password was actually modified
  if (!this._update.password) return next();

  // Hash password with cost of 12
  this._update.password = await hashPassword(this._update.password);

  // Delete confirmPassword field
  this._update.confirmPassword = undefined;
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
