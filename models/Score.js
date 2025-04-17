// models/Score.js

const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  score: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Pending', 'N/A'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);
