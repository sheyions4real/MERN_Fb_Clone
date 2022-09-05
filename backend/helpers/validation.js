// all validation functions

const User = require("../models/User");

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

exports.validateLength = (text, min, max) => {
  if (text.length > max || text.length < min) {
    return false;
  }
  return true;
};

exports.validateUsername = async (username) => {
  let a = false;
  do {
    let check = await User.findOne({ username });
    if (check) {
      // change username since it exist
      // generate a new number
      username += (+new Date() * Math.random()).toString().substring(0, 1);
      a = true; // keep looping until the username does not exist
    } else {
      a = false;
    }
  } while (a);
  return username;
};
