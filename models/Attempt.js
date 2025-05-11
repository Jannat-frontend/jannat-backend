const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attempt: Number,
  score: Number,
  status: { type: String, default: "Pending" }, // or "Paid"
});

module.exports = mongoose.model("Attempt", attemptSchema);
