const express = require("express");

const router = express.Router();

const { getPosts, getPost, createPost } = require("../controllers/posts");

const resourceType = require("../middlewares/resourceType");
const { protect } = require("../middlewares/auth");

router.route("/").get(getPosts).post(protect, createPost);

router.use("/:id", resourceType("Post"));
router.route("/:id").get(getPost);

module.exports = router;
