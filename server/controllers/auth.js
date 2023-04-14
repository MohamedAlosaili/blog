const User = require("../models/User");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// @desc     Register user
// @route    POST /auth/register
// @accesss  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  const user = await User.create({ name, username, email, password });

  sendResponseAndCookie(user, 201, res);
});

// @desc     Login user
// @route    POST /auth/login
// @accesss  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  // Check if user exists
  if (!user) {
    // It's better to provide a generic error message to protect your users against attackers
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check password
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendResponseAndCookie(user, 200, res);
});

const sendResponseAndCookie = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "None",
  };

  if (process.env.NODE_ENV === "production") options.secure = true;

  res.cookie("token", token, options);

  res.status(statusCode).json({ success: true, token });
};

// @desc     Logout user
// @route    GET /auth/logout
// @accesss  Private
exports.logout = (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
    sameSite: "None",
  };

  if (process.env.NODE_ENV === "production") options.secure = true;

  res.cookie("token", "", options);
  res
    .status(200)
    .json({ success: true, data: null, message: "Logged out successfully" });
};

// @desc     Get loggedin user
// @route    GET /auth/me
// @accesss  Private
exports.getCurrentUser = (req, res, next) =>
  res.status(200).json({ success: true, data: req.user });

// @desc     Forgot password
// @route    POST /auth/forgotpassword
// @accesss  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Check if the token is not expires
  if (user.resetPasswordExpire > Date.now()) {
    const remaining = Math.ceil(
      (user.resetPasswordExpire - Date.now()) / 1000 / 60
    );
    return next(
      new ErrorResponse(
        `Email successfully sent. Please check your inbox or wait for ${remaining} minute${
          remaining > 1 ? "s" : ""
        } before trying again.`
      )
    );
  }

  const token = user.getResetPasswordToken();

  const url = `${req.headers["x-client-url"]}/resetpassword/${token}`;
  await sendEmail(user.email, url, user.name);

  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json({ success: true, data: null, message: "Email sent successfully" });
});

// @desc     Reset password
// @route    POST /auth/resetpassword/:token
// @accesss  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  user.password = password;

  // Remove token
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendResponseAndCookie(user, 200, res);
});
