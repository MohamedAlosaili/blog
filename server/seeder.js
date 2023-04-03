require("dotenv").config({ path: "./config/config.env" });

const colors = require("colors");

const connectDB = require("./config/db");
connectDB();

// Models
const User = require("./models/User");
const Post = require("./models/Post");

// Data files
const users = require("./data/users.json");
const posts = require("./data/posts.json");

if (process.argv[2] === "-i") importData();
else if (process.argv[2] === "-d") deleteData();

async function importData() {
  try {
    await User.create(users);
    await Post.create(posts);

    console.log("Importing data...".green.inverse);
    process.exit();
  } catch (err) {
    console.log("failed to import data".red, err);
    process.exit();
  }
}

async function deleteData() {
  try {
    await User.deleteMany();
    await Post.deleteMany();

    console.log("Deleting data...".red.inverse);
    process.exit();
  } catch (err) {
    console.log("failed to import data".red, err);
    process.exit();
  }
}
