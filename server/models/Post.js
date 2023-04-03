const mongoose = require("mongoose");
const slugify = require("slugify");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      maxlength: [75, "Title cannot be more than 70 characters"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: [true, "Please add a summary"],
    },
    tags: {
      type: [String],
      required: [true, "Please add post tags"],
    },
    content: {
      type: String,
      required: [true, "Please add post content"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

PostSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Post", PostSchema);
