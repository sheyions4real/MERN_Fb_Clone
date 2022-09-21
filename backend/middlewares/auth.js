const jwt = require("jsonwebtoken");

exports.authUser = async (req, res, next) => {
  // next is used to pass the call when everything pass like .then call back function
  try {
    //console.log("here");

    let temp = req.header("Authorization");
    // console.log(temp);
    const token = temp ? temp.slice(7, temp.length) : ""; // remove the Bearer from then token string
    if (!token) {
      return res.status(400).json({ message: "Invalid Authentication" });
    }

    //console.log(token);
    // verify ad decode the token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid AUthentication" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
