const catchAsync = require('./../utils/catchAsync');
const errorController = require('./../controllers/errorController');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');

exports.getMe = catchAsync(async function (req, res, next) {
  return errorController(new AppError('Get my data is still to be impemented.', 501));
});

exports.getMyStats = catchAsync(async function (req, res, next) {
  return errorController(new AppError('Get my statistics is still to be impemented.', 501));
});

exports.getMyMatches = catchAsync(async function (req, res, next) {
  return errorController(new AppError('Get my matches is still to be impemented.', 501));
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.username);
  if (!user) {
    return errorController(new AppError('Wrong username!', 401));
  }
  if (user.active) {
    return errorController(new AppError('User is already activated!', 400));
  }
  user.active = true;
  if (await user.save()) {
    return res.status(200).json({ message: 'Your account has been activated successfully.' });
  }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user) {
    return errorController(new AppError('No user with that email!', 401));
  }
  if (!user.active) {
    return errorController(new AppError('Your profile is not activated!', 400));
  }
  const key = user.username;
  const token = jwt.sign({ key }, process.env.JWT_SECRET);
  const url = `${req.protocol}://${req.get('host')}/resetPassword/${token}`;
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  if (await user.save()) {
    sendEmail({
      email: user.email,
      subject: 'Password reset',
      message: `To reset your password, please click the link within the next 10 minutes.
        \n${url}`,
    });
    return res.status(200).json({
      message: 'Email has been sent. Check your inbox for password recovery instructions.',
    });
  }
});

exports.resetPassword = catchAsync(async function (req, res, next) {
  const user = await User.findOne({ passwordResetToken: req.params.token });

  if (!user) {
    return errorController(new AppError(`No user found, something wen't wrong!`, 404));
  }
  if (new Date(+Date.now()) > +user.passwordResetExpires) {
    return errorController(new AppError('Your password reset link has expired!', 403));
  }

  if (user && new Date(+Date.now()) < +user.passwordResetExpires) {
    return res.status(302).json({
      message: 'Please insert a new password in the highlighted field',
    });
  }
});

exports.passwordRedefined = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.username);
  if (!user.passwordResetToken || !user.passwordResetExpires) {
    return errorController(new AppError(`You don't have a password reset request!`, 403));
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
