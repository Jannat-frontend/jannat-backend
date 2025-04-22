const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Question = require('../models/Question');

// ✅ Ensure uploads/ directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// ✅ Multer setup
const upload = multer({ dest: 'uploads/' });

router.post('/upload-txt', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const blocks = raw.split(/\n{2,}/); // Split on empty lines

    const questions = blocks.map(block => {
      const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 7) return null;

      const options = [];
      for (let i = 1; i <= 4; i++) {
        options.push(lines[i].replace(/^Option [A-D]\s*/i, '').trim());
      }

      return {
        question: lines[0],
        options,
        answer: lines[5],
        difficulty: lines[6].toLowerCase()
      };
    }).filter(Boolean);

    if (!questions.length) {
      return res.status(400).json({ success: false, message: 'No valid questions found.' });
    }

    await Question.insertMany(questions);
    res.json({ success: true, count: questions.length });
  } catch (err) {
    console.error('❌ Upload Error:', err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

module.exports = router;
