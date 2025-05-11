const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");
const leaderboardRoutes = require("./routes/leaderboard");
const otpRoutes = require("./routes/otp");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

// API Routes
app.use("/api", authRoutes);
app.use("/api", paymentRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", otpRoutes);

app.get("/", (req, res) => res.send("Jannat Foundation Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
