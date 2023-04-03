const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  console.log(`Server connected to MongoDB successfully`.cyan.bold);
};

module.exports = connectDB;
