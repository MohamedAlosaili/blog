const Post = require("../models/Post");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Get all posts
// @route    GET /posts
// @accesss  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().select("-content");

  res.status(200).json({
    success: true,
    data: posts,
    count: posts.length,
  });
});

// @desc     Get single posts
// @route    GET /posts/:id
// @accesss  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // TODO: I will populate the author + reviews to single post
  const post = await Post.findById(id).populate("author", "username");

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc     Create posts
// @route    POST /posts
// @accesss  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  // Add author id
  req.body.author = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post,
  });
});
