const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');

// Save score to leaderboard
router.post('/submit', async (req, res) => {
  try {
    const { fullName, city, score, percentage } = req.body;

    const newEntry = new Leaderboard({
      fullName,
      city,
      score,
      percentage
    });

    await newEntry.save();
    res.status(201).json({ message: 'Score submitted to leaderboard' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting to leaderboard', error: error.message });
  }
});

// Get leaderboard entries
router.get('/', async (req, res) => {
  try {
    const users = await Leaderboard.find({}, "fullName city score paymentStatus createdAt")
      .sort({ score: -1, createdAt: 1 });

    let leaderboard = [];
    let lastScore = null;
    let currentRank = 0;

    users.forEach((user, index) => {
      if (user.score !== lastScore) {
        currentRank = index + 1;
        lastScore = user.score;
      }

      leaderboard.push({
        serial: index + 1,
        fullName: user.fullName,
        city: user.city,
        score: user.score,
        paymentStatus: user.paymentStatus || 'Pending',
        rank: currentRank,
        status: user.paymentStatus === 'Paid' ? 'Paid' : 'Pending'
      });
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});




// TEMP: Add test user
router.post('/test', async (req, res) => {
  try {
    const dummy = new Leaderboard({
  fullName: 'Test User',
  city: 'Test City',
  score: 5,
  percentage: 100,
  paymentStatus: 'Paid',
  upiId: 'test@upi',
  createdAt: new Date()
});

    await dummy.save();
    res.send('Dummy user added');
  } catch (err) {
    console.error('Error:', err);  // 🔥 This will help in terminal
    res.status(500).send('Error adding user');
  }
});

module.exports = router; // ✅ Important line to export the router
