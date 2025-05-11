const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, unique: true },
  password: { type: String, default: "1234" },
});

module.exports = mongoose.model("User", userSchema);
