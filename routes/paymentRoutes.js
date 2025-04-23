const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
require('dotenv').config();

// Setup Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // amount in paisa (₹20 = 2000)
    currency: 'INR',
    receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
});

module.exports = router;
