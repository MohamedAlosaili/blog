const User = require("../models/User");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

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

  user.password = undefined;

  sendResponseAndCookie(user, 200, res);
});

const sendResponseAndCookie = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = { expires: new Date(Date.now() + 60000), httpOnly: true };

  res.cookie("token", token, options);

  res.status(statusCode).json({ success: true, token });
};

// @desc     Logout user
// @route    GET /auth/logout
// @accesss  Private
exports.logout = (req, res, next) => {
  res.cookie("token", "", { expires: new Date(Date.now()) });
  res.status(200).json({ success: true, data: "Logged out successfully" });
};

// @desc     Get loggedin user
// @route    GET /auth/me
// @accesss  Private
exports.getCurrentUser = (req, res, next) =>
  res.status(200).json({ success: true, data: req.user });
