const User = require('../models/User');
const Referral = require('../models/Referral');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

exports.createReferral = async (req, res) => {
  const { email, phonenumber, username, referralcode } = req.body;

  // Basic Validation
  if (!email || !phonenumber || !username || !referralcode) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const newReferral = new Referral({ email, phonenumber, username, referralcode });
    await newReferral.save();

    // Send Referral Email
    await sendReferralEmail(email, phonenumber, username, referralcode);

    res.status(201).json(newReferral);
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ error: 'Error creating referral', details: error.message });
  }
};

// Send Referral Email Function
async function sendReferralEmail(email, phonenumber, username, referralcode) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Referral Code',
    text: `Hi ${username},\n\nYou have been referred! Your referral code is: ${referralcode}. Contact number: ${phonenumber}.`,
  };

  await transporter.sendMail(mailOptions);
}
