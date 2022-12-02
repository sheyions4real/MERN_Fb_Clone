const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    await post.populate("user", "picture first_name last_name username cover");
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    // will return all post
    // const posts = await Post.find()
    //   .populate("user", "first_name last_name picture gender username")
    //   .sort({ createdAt: -1 }); // return all post includes the user object for each post

    // Post of all those that are following me and all i am following

    // get all my following

    const followingTemp = await User.findById(req.user.id).select("following");
    //console.log(followingTemp); // returns the user id and an array of the following
    const following = followingTemp.following;

    // returns the array of promisses
    const promises = following.map((user) => {
      return Post.find({ user: user })
        .populate("user", "picture first_name last_name username cover")
        .populate(
          "comments.commentBy",
          "first_name last_name picture, username"
        )
        .sort({ createdAt: -1 })
        .limit(10);
    });

    // return the promise  of all post of people i am following
    const followingPosts = await (await Promise.all(promises)).flat(); // flat the arrary to remove the array result from inner array (get an array from array)
    //console.log(followingPosts);
    const userPosts = await Post.find({ user: req.user.id })
      .populate("user", "picture first_name last_name username cover")
      .populate("comments.commentBy", "first_name last_name picture, username")
      .sort({ createdAt: -1 })
      .limit(10);

    followingPosts.push(...[...userPosts]);
    followingPosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    // console.log(followingPosts);
    res.json(followingPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.comment = async (req, res) => {
  try {
    console.log("Command saving");
    const { comment, image, postId } = req.body;
    //console.log(image);
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            image: image,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentBy", "picture first_name last_name username");
    // console.log(newComments.comments);
    res.json(newComments.comments);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.savePost = async (req, res) => {
  try {
    console.log("saved post called");
    const postId = req.params.id;
    const user = await User.findById(req.user.id);
    const check = user?.savedPosts.find(
      (post) => post.post.toString() == postId
    );
    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savedPosts: {
            _id: check._id,
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedPosts: {
            post: postId,
            savedAt: new Date(),
          },
        },
      });
    }

    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    console.log("Delete Post called");
    await Post.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
