const express = require("express");
const { authUser } = require("../middlewares/auth");
const { reactPost, getReacts } = require("../controllers/reacts");

const router = express.Router();
router.put("/reactPost", authUser, reactPost);
router.get("/getReacts/:id", authUser, getReacts);

module.exports = router;
