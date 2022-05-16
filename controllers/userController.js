const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');

exports.profile = async function (req, res, next) {
  return res.status(501).json({ message: 'Get my data is still to be impemented.' });
};

exports.stats = async function (req, res, next) {
  return res.status(501).json({ message: 'Get my statistics is still to be impemented.' });
};

exports.matches = async function (req, res, next) {
  return res.status(501).json({ message: 'Get my matches is still to be impemented.' });
};

exports.activate = async (req, res, next) => {
  const user = await User.findByPk(req.params.username);
  if (user.active) {
    return res.status(400).json({ message: 'User is already activated!' });
  }
  try {
    user.active = true;
    if (await user.save()) {
      return res.status(200).json({ message: 'Your account has been activated successfully.' });
    }
  } catch (err) {
    return res.status(400).json({ message: 'Something went wrong with your activation!' });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
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
        message: 'Email has been sent. Check your inbox for password recovery instructions.',
      });
    }
  } catch (err) {
    user.passwordResetToken = undefined;
    user.ppasswordResetExpires = undefined;
    await user.save();
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.resetPassword = async function (req, res, next) {
  const user = await User.findOne({
    where: { passwordResetToken: req.params.token },
  });
  try {
    if (user && new Date(+Date.now()) < +user.passwordResetExpires) {
      return res.status(302).json({
        message: 'Please insert a new password in the highlighted field',
      });
    }
    if (!user || new Date(+Date.now()) > +user.passwordResetExpires) {
      return res.status(403).json({ message: 'Your password reset link has expired!' });
    }
  } catch (err) {
    return res.status(501).json({ message: 'Something went wrong!' });
  }
};

exports.changePassword = async (req, res, next) => {
  const user = await User.findByPk(req.params.username);
  try {
    if (!user.passwordResetToken || !user.passwordResetExpires) {
      return res.status(403).json({
        message: `You don't have a password reset request!`,
      });
    }
    user.password = req.body.newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    if (user.save()) {
      return res.status(200).json({
        message: `${req.params.username}, your password has been redefined successfully.`,
      });
    }
  } catch (err) {
    return res.status(501).json({
      message: `Something went wrong! \nYour password hasn't changed!`,
    });
  }
};
