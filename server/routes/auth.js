const express = require("express");

const router = express.Router();

const {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

const { protect } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getCurrentUser);

router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);

module.exports = router;
