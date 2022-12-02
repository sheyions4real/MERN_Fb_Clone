const React = require("../models/React");
const mongoose = require("mongoose");
const User = require("../models/User");
exports.reactPost = async (req, res) => {
  try {
    // console.log("save react post called");
    const { postId, react } = req.body;
    //console.log(react);
    //console.log(postId);
    // check if the react exist
    const exist = await React.findOne({
      postRef: postId,
      reactBy: mongoose.Types.ObjectId(req.user.id), // cconvert user.id to object type to match the model
    });
    // console.log(" post does not exist");
    // check if the react exist in db if it does remove it and if its not add it. if it exist but the react is different then remove it but if they are different update it
    if (exist == null) {
      const newReact = new React({
        react: react,
        postRef: postId,
        reactBy: req.user.id,
      });
      await newReact.save();
      // console.log("react saved");
      // return res.send(200).json({ message: "new react saved successfully" });
    } else {
      // check if the react in the db is the same with what is passed in the body
      // console.log("react exist");
      // console.log(exist.name);
      if (exist.react == react) {
        await React.findByIdAndRemove(exist._id);
        // return res.send(400).json({ message: "react removed successfully" });
      } else {
        await React.findByIdAndUpdate(exist._id, {
          react: react,
        });
        //return res.send(400).json({ message: "react updated successfully" });
      }
    }
  } catch (error) {
    return res.send(500).json({ message: error.message });
  }
};

// get all the reacts for a post by the id
exports.getReacts = async (req, res) => {
  try {
    // get all react for the post
    const reactsArray = await React.find({ postRef: req.params.id });
    /*
    const check1 = reacts.find(
      (x) => x.reactBy.toString() == req.user.id
    )?.react;
    */
    //use the reduce  function to group all similar likes in separate array
    // group represent the first element in the array initially if there is no implementatation or rule in the function
    // react represent every element in the array - its like map function
    //{} at the end is the initial value of the result, it could be an aray []  or empty string "" // if it is not provided then the group is returned
    // which is the new result of the grouped array by same sategory or value
    const newReacts = reactsArray.reduce((group, react) => {
      // group all the element by a value
      //let key = react.react; // or
      let key = react["react"];
      //use this method to group by the key
      group[key] = group[key] || []; // if the key exist then assign it or assign an empty array
      // or use thie method
      //   if (!group[key]) {
      //     group[key] = [];
      //   }
      group[key].push(react);
      //console.log(group);
      return group;
    }, {});

    const reacts = [
      {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
    ];
    //console.log(reacts);

    // check if i reacted to this post
    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });

    const user = await User.findById(req.user.id);
    const checkSaved = user?.savedPosts.find(
      (x) => x.post.toString() === req.params.id
    );

    res.json({
      reactsArray,
      reacts,
      check: check?.react,
      total: reactsArray.length,
      checkSaved: checkSaved ? true : false,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
