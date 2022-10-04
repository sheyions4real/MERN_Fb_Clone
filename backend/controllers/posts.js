const Post = require("../models/Post");
const { post } = require("../routes/post");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "first_name last_name picture gender username")
      .sort({ createdAt: -1 }); // return all post includes the user object for each post
    res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
