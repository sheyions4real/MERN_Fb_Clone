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
  updateDetails,
  addFriend,
  cancelFriendRequest,
  follow,
  unFollow,
  acceptRequest,
  unFriend,
  deleteRequest,
  search,
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  getFriendsPageInfos,
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
router.put("/updateDetails", authUser, updateDetails);
router.put("/addFriend/:friendId", authUser, addFriend);
router.put("/cancelFriendRequest/:friendId", authUser, cancelFriendRequest);
router.put("/follow/:friendId", authUser, follow);
router.put("/unfollow/:friendId", authUser, unFollow);
router.put("/acceptRequest/:friendId", authUser, acceptRequest);
router.put("/unFriend/:friendId", authUser, unFriend);
router.put("/deleteRequest/:friendId", authUser, deleteRequest);
router.post("/search/:searchTerm", authUser, search);
router.put("/addToSearchHistory", authUser, addToSearchHistory);
router.get("/getSearchHistory", authUser, getSearchHistory);
router.put("/removeFromSearch", authUser, removeFromSearch);
router.get("/getFriendsPageInfos", authUser, getFriendsPageInfos);
module.exports = router;
