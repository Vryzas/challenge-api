const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.getMe = catchAsync(async function (req, res, next) {
  return res
    .status(501)
    .json({ message: 'Get my data is still to be impemented.' });
});

exports.getMyStats = catchAsync(async function (req, res, next) {
  return res
    .status(501)
    .json({ message: 'Get my statistics is still to be impemented.' });
});

exports.getMyMatches = catchAsync(async function (req, res, next) {
  return res
    .status(501)
    .json({ message: 'Get my matches is still to be impemented.' });
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.username);
  if (!user) {
    return next(new AppError('Wrong username!', 401));
  }
  if (user.active) {
    return next(new AppError('User is already activated!', 400));
  }
  user.active = true;
  if (await user.save()) {
    return res
      .status(200)
      .json({ message: 'Your account has been activated successfully.' });
  }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError('No user with that email!', 401));
  }
  if (!user.active) {
    return next(new AppError('Your profile is not activated!', 400));
  }
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
});

exports.resetPassword = catchAsync(async function (req, res, next) {
  const user = await User.findOne({ passwordResetToken: req.params.token });

  if (user && new Date(+Date.now()) < +user.passwordResetExpires) {
    return res.status(302).json({
      message: 'Please insert a new password in the highlighted field',
    });
  }
  if (!user || new Date(+Date.now()) > +user.passwordResetExpires) {
    return res
      .status(403)
      .json({ message: 'Your password reset link has expired!' });
  }
});

exports.passwordRedefined = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.username);
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
});
