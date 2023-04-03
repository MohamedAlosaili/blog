const colors = require("colors");
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(`${err.stack}`.red);

  // Catch Validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map(err => err.message)
      .join(", ");
    error = new ErrorResponse(message, 400);
  }

  // Catch duplication error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ErrorResponse(
      `${field} already taken. Please choose a different ${field}.`,
      400
    );
  }

  res.status(error.statusCode || 500).json({
    success: false,
    data: null,
    error: error.message || "Server Failed",
  });
};

module.exports = errorHandler;
