const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phonenumber: { type: String, required: true },
  username: { type: String, required: true },
  referralcode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
