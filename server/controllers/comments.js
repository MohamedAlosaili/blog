const Comment = require("../models/Comment");
const Post = require("../models/Post");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Get all comments for post
// @route    GET /posts/postId/comments
// @accesss  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId }).populate(
    "author",
    "name username"
  );

  res.status(200).json({
    success: true,
    data: comments,
    count: comments.length,
  });
});

// @desc     Add comment for post
// @route    POST /posts/postId/comments
// @accesss  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  req.body.post = postId;
  req.body.author = req.user.id;
  const comment = await Comment.create(req.body);

  res.status(201).json({
    success: true,
    data: comment,
  });
});

// @desc     Update comment
// @route    PUT /comments/:id
// @accesss  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let comment = await Comment.findById(id);

  if (!comment) {
    return next(new ErrorResponse("Comment not found", 404));
  }

  if (req.user.id !== comment.author.toString()) {
    return next(
      new ErrorResponse("Not authorized to update this comment", 401)
    );
  }

  comment = await Comment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc     Delete comment
// @route    DELETE /comments/:id
// @accesss  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    return next(new ErrorResponse("Comment not found", 404));
  }

  if (req.user.id !== comment.author.toString()) {
    return next(
      new ErrorResponse("Not authorized to delete this comment", 401)
    );
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
