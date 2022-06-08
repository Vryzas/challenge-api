const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const Stat = require(`./../models/statsModel`);
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { sequelize } = require('./../models/userModel');

exports.getMe = catchAsync(async function (req, res, next) {
  // retrieves user info and stats in the same query (except password)
  const [userProfile, metadata] = await sequelize.query(
    `SELECT u.username, u.email, s.victories, s.draws, s.defeats FROM Users u, Stats s WHERE u.username='${req.query.username}' AND s.username=u.username;`
  );
  if (userProfile.length === 0) {
    return res.status(404).json({ message: `Failed to get ${req.query.username} profile data!` });
  }
  return res.status(200).json({ message: `Found ${req.query.username} profile.`, data: userProfile });
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ where: { passwordResetToken: req.params.token } });
  if (!user) {
    return next(new AppError(`This token isn't valid!`, 401));
  }
  user.active = true;
  user.passwordResetToken = null;
  if (await user.save()) {
    await Stat.create({ username: user.username });
    return res.status(200).json({ message: 'Your account has been activated successfully.' });
  }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
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
  const user = await User.findOne({
    where: { passwordResetToken: req.params.token },
  });
  if (!user || new Date(+Date.now()) > +user.passwordResetExpires) {
    console.log(user);
    return next(new AppError('Your password reset link has expired!', 403));
  }

  if (user && new Date(+Date.now()) < +user.passwordResetExpires) {
    return res.status(302).json({
      message: 'Please insert a new password in the highlighted field.',
    });
  }
});

exports.passwordRedefined = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.body.username);
  if (!user.passwordResetToken || !user.passwordResetExpires) {
    return next(new AppError(`You don't have a password reset request!`, 403));
  }
  user.password = req.body.newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  if (user.save()) {
    return res.status(200).json({
      message: `${req.body.username}, your password has been redefined successfully.`,
    });
  }
});
