const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// ✅ Bulk insert via JSON (textarea upload)
router.post('/bulk', async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: "Invalid format: expected an array" });
    }

    const formatted = questions.map(q => ({
      question: q.question,
      options: q.options,
      answer: q.answer,
      difficulty: q.difficulty?.toLowerCase() === 'hard' ? 'hard' : 'easy'
    }));

    await Question.insertMany(formatted);
    res.json({ success: true, count: formatted.length });
  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// ✅ Fetch for quiz screen
router.get('/fetch', async (req, res) => {
  try {
    const questions = await Question.find().limit(5);
    res.json({ success: true, questions });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: "Unable to load questions" });
  }
});

module.exports = router;
