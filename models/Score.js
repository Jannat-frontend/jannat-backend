const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  attempt: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);

