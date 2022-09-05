const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const User = require("../models/User");

const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail } = require("../helpers/mailer");

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
    console.log(encryptedPassword);

    let tempUsername = first_name + last_name;
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
      username: user.username,
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
