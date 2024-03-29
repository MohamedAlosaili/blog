const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypt and hash the password
UserSchema.pre("save", async function (next) {
  if (!this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next();
  } catch (err) {
    next(err);
  }
});

// Match user entered password with password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign and return a new JWT(Json Web Token)
UserSchema.methods.getJwtToken = function (type) {
  const expiresIn = type === "password" ? "10m" : process.env.JWT_EXPIRE;

  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn });
};

// Get reset Password Token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashed an store the reset token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Reset token expiration
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
