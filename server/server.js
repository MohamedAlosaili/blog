require("dotenv").config({ path: "./config/config.env" });

const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const colors = require("colors");
const cookieParser = require("cookie-parser");

// Route files
const auth = require("./routes/auth");
const posts = require("./routes/posts");
const comments = require("./routes/comments");

// Create express App
const app = express();
connectDB();

// Parse Request Body
app.use(express.json({ limit: "30mb" }));

// Parse cookie
app.use(cookieParser());

// # Securty middlewares #
// Sanitize Data to prevent NoSQL injection
app.use(mongoSanitize());
// Helmet secure Express app by setting various HTTP security headers.
app.use(helmet());
// Prevent cross-site scripting (XSS) attack
app.use(xss());
// Limit requests per id to 60 request per period of time
// You can limit certain routes e.g. resetpassword route
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000, // 60 request limit per 5 minutes
    max: 60,
  })
);
// Protect against HTTP Parameter Pollution attacks
app.use(hpp());
// CORS enable other domains to connect and make requests to this API
app.use(cors());

// Mount routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/posts", posts);
app.use("/api/v1/comments", comments);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`.yellow.bold);
  console.log(`Environment: ${process.env.NODE_ENV}`.green.bold);
});

process.on("unhandledRejection", err => {
  console.log(`${err?.toString()} ❌`.red);
  console.log(err?.stack);

  server.close(() => process.exit(1));
});
