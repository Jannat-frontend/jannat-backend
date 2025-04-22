const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require("../models/User"); // ✅ FIXED import

require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ Create Order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 10000)}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
});

// ✅ Save payment after success
router.post('/save-payment', async (req, res) => {
  try {
    const { paymentId, orderId, email, mobile } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const payment = new Payment({
      paymentId,
      orderId,
      email,
      mobile,
      upiId: user.upi || "From Razorpay"
    });

    await payment.save();
    res.status(201).json({ message: 'Payment details saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save payment details', error: err.message });
  }
});

module.exports = router;
