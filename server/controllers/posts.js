const Post = require("../models/Post");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Get all posts
// @route    GET /posts
// @accesss  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find()
    .select("-content")
    .sort("-createdAt")
    .populate("author", "name username");

  res.status(200).json({
    success: true,
    data: posts,
    count: posts.length,
  });
});

// @desc     Search posts
// @route    GET /posts/search
// @accesss  Public
exports.searchPosts = asyncHandler(async (req, res, next) => {
  // Clean the query
  req.query.q = req.query.q.replace(/%20/g, " ");
  const pattern = new RegExp(req.query.q, "i");

  const posts = await Post.find({ title: { $regex: pattern } });

  res.status(200).json({ success: true, data: posts, count: posts.length });
});

// @desc     Get single posts
// @route    GET /posts/:id
// @accesss  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate([
    { path: "author", select: "name username" },
    {
      path: "comments",
      populate: { path: "author", select: "name username" },
    },
  ]);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc     Create post
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

// @desc     Update post
// @route    PUT /posts/:id
// @accesss  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let post = await Post.findById(id);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  // Check if the current user is the author of the post
  if (req.user.id !== post.author.toString()) {
    return next(new ErrorResponse("Not authorized to update this post", 401));
  }

  post = await Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc     Delete post
// @route    DELETE /posts/:id
// @accesss  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  // Check if the current user is the author of the post
  if (req.user.id !== post.author.toString()) {
    return next(new ErrorResponse("Not authorized to delete this post", 401));
  }

  await post.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
