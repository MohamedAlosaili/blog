const express = require("express");
const multer = require("multer");
const upload = multer();

const router = express.Router();

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
} = require("../controllers/posts");

const resourceType = require("../middlewares/resourceType");
const { protect } = require("../middlewares/auth");
const uploadToFirebaseStorage = require("../middlewares/uploadToStorage");

// Redirect posts/postId/comments to comments route
const commentRouter = require("./comments");
router.use("/:postId/comments", commentRouter);

router
  .route("/")
  .get(getPosts)
  .post(
    protect,
    upload.single("coverImage"),
    uploadToFirebaseStorage,
    createPost
  );

router.get("/search", searchPosts);

router.use("/:id", resourceType("Post"));
router
  .route("/:id")
  .get(getPost)
  .put(
    protect,
    upload.single("coverImage"),
    uploadToFirebaseStorage,
    updatePost
  )
  .delete(protect, deletePost);

module.exports = router;
