const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.send({ success: true, user });
  } catch (err) {
    res.send({ success: false, message: "Mobile already registered" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { mobile } = req.body;
  const user = await User.findOne({ mobile });
  if (user) {
    res.send({ success: true, user });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
