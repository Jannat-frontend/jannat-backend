const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");
const leaderboardRoutes = require("./routes/leaderboard");
const otpRoutes = require("./routes/otp");

const app = express();

// ✅ Apply CORS with domain whitelist
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

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

// ✅ API Routes
app.use("/api", authRoutes);
app.use("/api", paymentRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", otpRoutes);

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("Jannat Foundation Backend is running");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
