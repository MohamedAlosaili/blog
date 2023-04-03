require("dotenv").config({ path: "./config/config.env" });

const express = require("express");

// Create express App
const app = express();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server is running on PORT:${PORT}`)
);
