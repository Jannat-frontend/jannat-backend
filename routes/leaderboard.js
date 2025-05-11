const express = require("express");
const Attempt = require("../models/Attempt");
const User = require("../models/User");

const router = express.Router();

// Get all leaderboard entries
router.get("/leaderboard", async (req, res) => {
  const entries = await Attempt.find().populate("userId").sort({ attempt: -1 });
  const formatted = entries.map(e => ({
    _id: e._id,
    name: e.userId.name,
    score: e.score,
    attempt: e.attempt,
    status: e.status,
  }));
  res.json(formatted);
});

// Submit score
router.post("/submit-score", async (req, res) => {
  const { userId, score } = req.body;
  const last = await Attempt.findOne({ userId }).sort({ attempt: -1 });

  if (last) {
    last.score = score;
    await last.save();
  }

  res.send({ success: true });
});

// Mark as paid
router.post("/mark-paid/:id", async (req, res) => {
  await Attempt.findByIdAndUpdate(req.params.id, { status: "Paid" });
  res.send({ success: true });
});

module.exports = router;
