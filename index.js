// backend-app/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Models
const User = require('./models/User');
const Score = require('./models/Score');

// Routes
app.post('/register', async (req, res) => {
  const { name, city, email, mobile, password } = req.body;
  try {
    const user = new User({ name, city, email, mobile, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/save-upi/:mobile', async (req, res) => {
  const { upi } = req.body;
  try {
    const user = await User.findOneAndUpdate({ mobile: req.params.mobile }, { upi }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/payment', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  try {
    const order = await razorpay.orders.create({ amount, currency, receipt });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Payment failed' });
  }
});

app.post('/submit-score', async (req, res) => {
  const { name, city, score, status } = req.body;
  try {
    const result = new Score({ name, city, score, status });
    await result.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const results = await Score.find().sort({ score: -1 }).limit(20);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
