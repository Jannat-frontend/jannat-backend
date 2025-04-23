const express = require('express');
const router = express.Router();
const Score = require('../models/Score'); // ✅ Using Score model

// GET leaderboard
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find({})
      .populate('userId', 'name city') // optional: joins user info
      .sort({ score: -1, createdAt: 1 });

    const leaderboard = scores.map((entry, index) => {
      return {
        rank: index + 1,
        name: entry.userId?.name || "Unknown",
        city: entry.userId?.city || "Unknown",
        score: entry.score,
        attempt: entry.attempt,
        status: entry.status
      };
    });

    res.status(200).json({ leaderboard });
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

module.exports = router;
