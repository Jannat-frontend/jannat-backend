const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const shortid = require("shortid");
const Attempt = require("../models/Attempt");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create ₹20 order
router.post("/create-order", async (req, res) => {
  const { userId } = req.body;

  const options = {
    amount: 2000, // ₹20 = 2000 paise
    currency: "INR",
    receipt: shortid.generate(),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send("Order failed");
  }
});

// Verify and start attempt
router.post("/verify-payment", async (req, res) => {
  const { userId } = req.body;

  const previous = await Attempt.find({ userId });
  const attemptNum = previous.length + 1;

  await Attempt.create({
    userId,
    attempt: attemptNum,
    score: 0,
    status: "Pending",
  });

  res.send({ success: true });
});

module.exports = router;
