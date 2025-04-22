const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ✅ correct naming

// Register new user
router.post('/register', async (req, res) => {
  const { fullName, city, pinCode, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({ fullName, city, pinCode, email, mobile, password });
    const saved = await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: saved._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { password: pwd, ...userWithoutPassword } = user._doc;

    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
