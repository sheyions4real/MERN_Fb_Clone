const express = require("express");

const router = express.Router();
const { authUser } = require("../middlewares/auth");
const {
  createPost,
  getAllPosts,
  comment,
  savePost,
  deletePost,
} = require("../controllers/posts");
router.post("/createPost", authUser, createPost);
// retrieve post
router.get("/getAllPosts", authUser, getAllPosts);
router.put("/comment", authUser, comment);
router.put("/savePost/:id", authUser, savePost);
router.delete("/deletePost/:id", authUser, deletePost);
module.exports = router;
