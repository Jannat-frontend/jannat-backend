const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// POST /api/questions/add - Upload a new quiz question (Admin only)
router.post('/add', async (req, res) => {
  console.log("POST /api/questions/add hit");
  const { questionText, options, correctOption, difficulty } = req.body;

  // ✅ Basic Validation
  if (
    !questionText ||
    !options ||
    !Array.isArray(options) ||
    options.length < 2 ||
    !correctOption ||
    !difficulty
  ) {
    return res.status(400).json({
      message: 'Please provide all required fields: questionText, options (min 2), correctOption, difficulty'
    });
  }

  try {
    const newQuestion = new Question({ questionText, options, correctOption, difficulty });
    await newQuestion.save();
    res.status(201).json({ message: 'Question added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/questions/fetch - Get 3 easy + 2 hard questions (without correctOption)
router.get('/fetch', async (req, res) => {
  try {
    const easyQuestions = await Question.aggregate([
      { $match: { difficulty: 'easy' } },
      { $sample: { size: 3 } }
    ]);

    const hardQuestions = await Question.aggregate([
      { $match: { difficulty: 'hard' } },
      { $sample: { size: 2 } }
    ]);

    const allQuestions = [...easyQuestions, ...hardQuestions];

    // ✅ Don't send correctOption to frontend
    const formattedQuestions = allQuestions.map((q) => ({
      id: q._id,
      question: q.questionText,
      options: q.options
    }));

    res.json({ success: true, questions: formattedQuestions });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ success: false, message: 'Error fetching questions' });
  }
});

module.exports = router;
