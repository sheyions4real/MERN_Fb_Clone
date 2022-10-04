const express = require("express");

const router = express.Router();
const { authUser } = require("../middlewares/auth");
const { createPost, getAllPosts } = require("../controllers/posts");
router.post("/createPost", authUser, createPost);
// retrieve post
router.get("/getAllPosts", authUser, getAllPosts);
module.exports = router;
