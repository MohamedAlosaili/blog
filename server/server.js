require("dotenv").config({ path: "./config/config.env" });

const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

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

// Mount routes
app.use("/auth", auth);
app.use("/posts", posts);
app.use("/comments", comments);

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
