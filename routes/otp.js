const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/User");

const otpMemory = {};

router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpMemory[mobile] = otp;

  try {
    await axios.post("https://www.fast2sms.com/dev/bulkV2", {
      route: "otp",
      variables_values: otp,
      numbers: mobile
    }, {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      }
    });

    res.send({ success: true });
  } catch (err) {
    console.error("SMS failed:", err.response?.data || err.message);
    res.send({ success: false, message: "Failed to send OTP" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { mobile, otp, newPassword } = req.body;

  if (otpMemory[mobile] == otp) {
    await User.findOneAndUpdate({ mobile }, { password: newPassword });
    delete otpMemory[mobile];
    res.send({ success: true });
  } else {
    res.send({ success: false, message: "Invalid OTP" });
  }
});

module.exports = router;
