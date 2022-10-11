const express = require("express");
const { authUser } = require("../middlewares/auth");
const {
  register,
  activate,
  login,
  auth,
  sendVerification,
  findUser,
  sendResetCodeVerification,
  validateResetCode,
  changePassword,
  getProfile,
  updateProfilePicture,
  updateCoverPicture,
} = require("../controllers/users");

const router = express.Router();

router.post("/register", register);
router.post("/activate", authUser, activate); // pass the request to the authenticaion middleware to get the user id added to the request
router.post("/login", login);
router.post("/auth", authUser, auth); // add the authentication middleware authUser
router.post("/sendVerification", authUser, sendVerification);
router.post("/findUser", findUser);
router.post("/sendResetCodeVerification", sendResetCodeVerification);
router.post("/validateResetCode", validateResetCode);
router.post("/changePassword", changePassword);
router.get("/getProfile/:username", authUser, getProfile);
router.put("/updateProfilePicture", authUser, updateProfilePicture);
router.put("/updateCoverPicture", authUser, updateCoverPicture);
module.exports = router;
