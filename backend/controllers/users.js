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
    const profile = await User.findOne({ username }).select("-password"); // return all the user details except the password
    if (!profile) {
      return res.json({ ok: false });
    }

    // get the post for the user profile returned
    const posts = await Post.find({ user: profile._id })
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ ...profile.toObject(), posts });
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
