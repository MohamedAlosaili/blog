require("dotenv").config({ path: "./config/config.env" });

const colors = require("colors");

const connectDB = require("./config/db");
connectDB();

// Models
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// Data files
const users = require("./data/users.json");
const posts = require("./data/posts.json");
const comments = require("./data/comments.json");

if (process.argv[2] === "-i") importData();
else if (process.argv[2] === "-d") deleteData();

async function importData() {
  try {
    await User.create(users);
    await Post.create(posts);
    await Comment.create(comments);

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
    await Comment.deleteMany();

    console.log("Deleting data...".red.inverse);
    process.exit();
  } catch (err) {
    console.log("failed to import data".red, err);
    process.exit();
  }
}
