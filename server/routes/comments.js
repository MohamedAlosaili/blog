const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments");

const { protect } = require("../middlewares/auth");

router.route("/").get(getComments).post(protect, addComment);

router.route("/:id").put(protect, updateComment).delete(protect, deleteComment);

module.exports = router;
