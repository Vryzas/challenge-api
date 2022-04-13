const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.getMe = async function (req, res, next) {
  return res
    .status(501)
    .json({ message: 'Get my data is still to be impemented.' });
};

exports.getMyStats = async function (req, res, next) {
  return res
    .status(501)
    .json({ message: 'Get my statistics is still to be impemented.' });
};

exports.getMyMatches = async function (req, res, next) {
  return res
    .status(501)
    .json({ message: 'Get my matches is still to be impemented.' });
};

exports.activateAccount = async (req, res, next) => {
  // check if user exists and is already activated
  const user = await User.findByPk(req.params.username);
  if (!user || user.active) {
    return res
      .status(400)
      .json({ message: 'Wrong username or user is already activated!' });
  }
  try {
    user.active = true;
    if (await user.save()) {
      return res
        .status(200)
        .json({ message: 'Your account has been activated successfully.' });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Something went wrong with your activation!' });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user || !user.active) {
    return res
      .status(404)
      .json({ message: 'No user with that email or user is not active!' });
  }
  try {
    const key = user.username;
    const token = jwt.sign({ key }, process.env.JWT_SECRET);
    const url = `${req.protocol}://${req.get('host')}/resetPassword/${token}`;
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    if (await user.save()) {
      await sendEmail({
        email: user.email,
        subject: 'Password reset',
        message: `To reset your password, please click the link within the next 10 minutes.
        \n${url}`,
      });
      return res.status(200).json({
        message:
          'Email has been sent. Check your inbox for password recovery instructions.',
      });
    }
  } catch (err) {
    user.passwordResetToken = undefined;
    user.ppasswordResetExpires = undefined;
    await user.save();
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};
