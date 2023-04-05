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
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
  }
);

PostSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Virtual populate
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

module.exports = mongoose.model("Post", PostSchema);
