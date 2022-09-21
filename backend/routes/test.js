const express = require("express");

const router = express.Router();

// test the backend api
router.get("/test", (req, res) => {
  return res.status(200).json({ message: "Api is up and running" });
});

module.exports = router;
