const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const uploadTxtRoutes = require('./routes/uploadTxt'); // ✅ for question upload

const app = express();

// ✅ FIXED: Only one CORS config, simplified and secure
app.use(cors({
  origin: [
    "http://localhost:5500",
    "https://jannat-frontend.vercel.app",
    "https://www.jannatfoundationquiz.com",
    "https://jannatfoundationquiz.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/upload-txt', uploadTxtRoutes); // ✅ route to handle .txt upload

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
