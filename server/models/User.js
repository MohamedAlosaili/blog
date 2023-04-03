const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    username: {
      type: String,
      required: [true, "Please add a username"],
      trim: true,
      maxlength: [50, "username cannot be more than 100 characters"],
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please add an email"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/, "Please add a valid email"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [32, "Password cannot be at more than 32 characters"],
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
