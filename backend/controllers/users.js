const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const Post = require("../models/Post");
const User = require("../models/User");
const Code = require("../models/Code");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const { generateCode } = require("../helpers/generateCode");

// test the API  Service
exports.auth = (req, res) => {
  res.status(200).json({ message: "welcome to auth" });
};

// user registration repository function
exports.register = async (req, res) => {
  try {
    // mapping the request body to an object
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    console.log(validateEmail(email));

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid Email Address" });
    }

    // check if the email already exist in the database
    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          "Email address already in use. please try another email address",
      });
    }

    // check for the length of the firstname
    if (!validateLength(first_name, 2, 30)) {
      return res.status(400).json({
        message: "Firstname must be between 3 and 30 characters length",
      });
    }
    // check for the length of the  lastname
    if (!validateLength(last_name, 2, 30)) {
      return res.status(400).json({
        message: "Lastname must be between 3 and 30 characters length",
      });
    }

    // check for the length of the  lastname
    if (!validateLength(password, 8, 50)) {
      return res.status(400).json({
        message: "Password must be between 8 and 50 characters length",
      });
    }

    // encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 12);
    // console.log(encryptedPassword);

    let tempUsername = first_name.toLowerCase() + last_name.toLowerCase();
    let newUsername = await validateUsername(tempUsername);

    //console.log(newUsername);

    // return res.json({ ok: email });
    const user = await new User({
      first_name,
      last_name,
      username: newUsername,
      email,
      password: encryptedPassword,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save(); // saves the new user to the database

    // generate the email verification token with the user is and send via wmail to the user email
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );

    // build the activation link
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    //console.log(url);
    // send the email for activation
    sendVerificationEmail(user.email, user.first_name, url);

    // generate a token and send back to the user which the user will write to cookie to send for each request to validate the user
    const token = generateToken({ id: user._id.toString() }, "7d");

    res.send({
      id: user._id,
      username: user.username.toLowerCase(),
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token, // to be written to the user cookie
      verified: user.verified,
      message: "Register Success ! please activate your email to start",
    });
    // console.log("User Created Successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// activate user repository function
exports.activate = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body; // deconstruct the token from the body
    // console.log(token);
    const user = jwt.verify(token, process.env.TOKEN_SECRET); // decode the token to return the userid (the user id was used using the same key to generate the token)
    //console.log(user);

    const check = await User.findById(user.id);

    //check if the user id passed from the frontend is the same as the user in the jwt token
    // ensure the user who wants to validate his email is the same user logged in
    // this will prevent another facebook user to verify another users email and direct them to their page
    if (validUser !== user.id) {
      // not a vaid user
      return res.status(400).json({
        message:
          "You dont have the authorization to complete this verification",
      });
    }

    if (check.verified == true) {
      return res
        .status(400)
        .json({ message: "User account has already been verified" });
    } else {
      // update the user
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: "Account has been verified successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  //
};

// handle login operation
exports.login = async (req, res) => {
  try {
    // deconstruct username and password from the request body
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "This email address is not connected to any account",
      });
    }

    // the user exist hash the password in the request body and compare with the user.password
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid Credentials, Please try again",
      });
    }

    // the password is correct, generate token and return the user object
    // generate a token and send back to the user which the user will write to cookie to send for each request to validate the user
    const token = generateToken({ id: user._id.toString() }, "7d");

    res.status(200).send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token, // to be written to the user cookie
      verified: user.verified,
      // message: "Login Success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res
        .status(400)
        .json({ message: "This user has already been verified" });
    }
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    // if not verified
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    //console.log(url);
    // sendVerificationEmail(user.email, user.first_name, url); replace with mailgun or another email api

    return res
      .status(200)
      .json({ message: "Email verification link has been send to your email" });
  } catch (error) {
    //console.log("error");
    return res.status(500).json({ message: error.message });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    } else {
      return res.status(200).json({
        email: user.email,
        picture: user.picture,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendResetCodeVerification = async (req, res) => {
  try {
    const { email } = req.body;
    // get the user who call the req by the email parameter
    const user = await User.findOne({ email }).select("-password");

    // find the user in the Code collection and remove the user existing code if it exist
    await Code.findOneAndRemove({ user: user?._id });

    const code = generateCode(5);
    // saves the generated cod to the Code collection
    const savedCode = await new Code({
      code: code,
      user: user._id,
    }).save();

    // send the email
    //sendResetCode(email, user.first_name, code); replace with mailgun or another email api
    return res
      .status(200)
      .json({ message: "Email reset code has been sent to the user email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const dbCode = await Code.findOne({ user: user._id });
    //console.log(dbCode.code);
    //console.log(code);
    if (dbCode.code !== code) {
      return res.status(400).json({ message: "Verification Code is wrong" });
    }

    return res.status(200).json({ message: "Ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cryptedPassword = await bcrypt.hash(password, 12);
    //find the user and update the password
    await User.findOneAndUpdate({ email }, { password: cryptedPassword });
    return res
      .status(200)
      .json({ message: "User password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findById(req.user.id);

    const profile = await User.findOne({ username }).select("-password"); // return all the user details except the password

    // default object for the relationship of username and the loginin user making the request if the user is viewing another persons profile
    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };

    if (!profile) {
      return res.json({ ok: false });
    }

    // check if we are profile is my friend or i am his friend
    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true;
    }
    // check if the profile is in the list of my following
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    // see if the profile id is in the list of my friends request
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }

    // check if i have sent the profile user a friend request
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }

    // get the post for the user profile returned
    const posts = await Post.find({ user: profile._id })
      .populate("user")
      .sort({ createdAt: -1 });

    await profile.populate("friends", "first_name last_name username picture"); // include the friends user fields as listed
    res.json({ ...profile.toObject(), posts, friendship });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    //console.log(" updateProfilePicture I was called");
    // get the user.id from the req added by the authUser middleware
    const { url } = req.body;
    const response = await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    res.json(url);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateCoverPicture = async (req, res) => {
  try {
    //console.log(" updateCoverPicture I was called");
    // get the user.id from the req added by the authUser middleware
    const { url } = req.body;
    const response = await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });
    res.json(url);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    // console.log("update details");
    const { info } = req.body;
    //console.log(info);
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: info,
      },
      { new: true } // add this paramenter to return the new or updated value to the updated variable
    );
    console.log(updated);
    res.json(updated.details);
  } catch (error) {}
};

exports.addFriend = async (req, res) => {
  try {
    const user = req.user.id;
    const friendId = req.params.friendId;
    if (user !== friendId) {
      const sender = await User.findById(user);
      const receiver = await User.findById(friendId);
      // check if already friend with receiver
      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        // not friends and no previews friend request sent
        // push the sender id into the array
        await receiver.updateOne({
          $push: { requests: sender._id },
        });
        // add the sender to followers list
        await receiver.updateOne({
          $push: { followers: sender._id },
        });

        // push the receiver id into the sender request array
        await sender.updateOne({
          $push: { following: receiver._id },
        });

        return res
          .status(200)
          .json({ message: "Friend Request has been sent" });
      } else {
        return res.status(400).json({ message: "Friend Request already sent" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You cant send friend request to yourself" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.cancelFriendRequest = async (req, res) => {
  try {
    const user = req.user.id;
    const friendId = req.params.friendId;
    if (user !== friendId) {
      const sender = await User.findById(user);
      const receiver = await User.findById(friendId);
      // check if already friend with receiver
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        // not friends and no previews friend request sent
        // push the sender id into the array
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        // add the sender to followers list
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });

        // remove the receiver id from the sender request array
        await sender.updateOne({
          $pull: { following: receiver._id },
        });

        return res
          .status(200)
          .json({ message: "Friend Request has been cancelled" });
      } else {
        return res
          .status(400)
          .json({ message: "Friend Request already canceled" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You cant send friend request to yourself" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.friendId) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.friendId);
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        });

        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "follow success" });
      } else {
        return res.status(400).json({ message: "Already following" });
      }
    } else {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
  // try {
  //   console.log("called");
  //   const user = req.user.id;
  //   const friendId = req.params.friendId;
  //   console.log(friendId);
  //   console.log(user);
  //   if (user !== friendId) {
  //     const sender = await User.findById(user);
  //     const receiver = await User.findById(friendId);
  //     // check if already friend with receiver
  //     if (
  //       !receiver.followers.includes(sender._id) &&
  //       !sender.following.includes(receiver._id)
  //     ) {
  //       // not friends and no previews following
  //       // push the sender id into the array of the receiver followers
  //       await receiver.updateOne({
  //         $push: { followers: sender._id },
  //       });

  //       // push the receiver id into the sender request array
  //       await sender.updateOne({
  //         $push: { following: receiver._id },
  //       });

  //       return res.status(200).json({ message: "Following successful" });
  //     } else {
  //       return res.status(400).json({ message: "Already following" });
  //     }
  //   } else {
  //     console.log("error");
  //     return res.status(400).json({ message: "You cant follow yourself" });
  //   }
  // } catch (error) {
  //   console.log(error.message);
  //   return res.status(500).json({ message: error.message });
  // }
};

exports.unFollow = async (req, res) => {
  try {
    const user = req.user.id;
    const friendId = req.params.friendId;
    if (user !== friendId) {
      const sender = await User.findById(user);
      const receiver = await User.findById(friendId);
      // check if already friend with receiver
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        // not friends and no previews following
        // push the sender id into the array of the receiver followers
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });

        // push the receiver id into the sender request array
        await sender.updateOne({
          $pull: { following: receiver._id },
        });

        return res.status(200).json({ message: "un following successful" });
      } else {
        return res.status(400).json({ message: "Already not following" });
      }
    } else {
      return res.status(400).json({ message: "You cant un follow yourself" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const user = req.user.id;
    const friendId = req.params.friendId;
    //console.log(user);
    // console.log(friendId);

    if (user !== friendId) {
      const receiver = await User.findById(user);
      const sender = await User.findById(friendId);
      // check if sender friend request exist for the receiver to accept the request
      if (receiver.requests.includes(sender._id)) {
        // not friends and no previews following
        // push the sender id into the array of the receiver  friends and followers
        await receiver.update({
          $push: { friends: sender._id, following: sender._id },
        });

        // push the receiver id into the sender request and followers array
        await sender.update({
          $push: { friends: receiver._id, followers: receiver._id },
        });

        // remove the sender from request array
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });

        return res
          .status(200)
          .json({ message: "Friend request accepted successful" });
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You cant accept a request from yourself" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.unFriend = async (req, res) => {
  try {
    const user = req.user.id;
    const friendId = req.params.friendId;
    if (user !== friendId) {
      const sender = await User.findById(user);
      const receiver = await User.findById(friendId);
      // check if sender friendship with the receiver  exist
      if (
        receiver.friends.includes(sender._id) &&
        sender.friends.includes(receiver._id)
      ) {
        // not friends and no previews following
        // push the sender id into the array of the receiver  friends and followers
        await receiver.update({
          $pull: {
            friends: sender._id,
            following: sender._id,
            followers: sender._id,
          },
        });

        // push the receiver id into the sender request and followers array
        await sender.update({
          $pull: {
            friends: receiver._id,
            following: receiver._id,
            followers: receiver._id,
          },
        });

        return res
          .status(200)
          .json({ message: "un Friend request successful" });
      } else {
        return res.status(400).json({ message: "Already not friends" });
      }
    } else {
      return res.status(400).json({ message: "You cant unfriend yourself" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.friendId) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.friendId);
      if (receiver.requests.includes(sender._id)) {
        await receiver.update({
          $pull: {
            requests: sender._id,
            followers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            following: receiver._id,
          },
        });

        res.json({ message: "delete request accepted" });
      } else {
        return res.status(400).json({ message: "Already deleted" });
      }
    } else {
      return res.status(400).json({ message: "You can't delete yourself" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
  // try {
  //   const user = req.user.id;
  //   const friendId = req.params.friendId;

  //   console.log(user);
  //   console.log(friendId);

  //   if (user !== friendId) {
  //     const sender = await User.findById(user);
  //     const receiver = await User.findById(friendId);
  //     // check if sender friendship with the receiver  exist
  //     if (sender.requests.includes(receiver._id)) {
  //       // not friends and no previews following
  //       // push the sender id into the array of the receiver  friends and followers
  //       await sender.update({
  //         $pull: {
  //           requests: sender._id,
  //           followers: sender._id,
  //         },
  //       });

  //       // push the receiver id into the sender request and followers array
  //       await receiver.updateOne({
  //         $pull: {
  //           following: receiver._id,
  //         },
  //       });

  //       return res
  //         .status(200)
  //         .json({ message: "Friend request deleted successful" });
  //     } else {
  //       console.log("alreadt");
  //       return res.status(400).json({ message: "Already Deleted" });
  //     }
  //   } else {
  //     console.log("error.message");
  //     return res.status(400).json({ message: "You cant delete yourself" });
  //   }
  // } catch (error) {
  //   console.log(error.message);
  //   return res.status(500).json({ message: error.message });
  // }
};
