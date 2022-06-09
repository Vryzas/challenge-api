const catchAsync = require('./../utils/catchAsync');
const errorController = require('./../controllers/errorController');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');

exports.getMe = catchAsync(async function (req, res, next) {
  errorController(new AppError('Get my data is still to be impemented.', 501), res);
});

exports.getMyStats = catchAsync(async function (req, res, next) {
  errorController(new AppError('Get my statistics is still to be impemented.', 501), res);
});

exports.getMyMatches = catchAsync(async function (req, res, next) {
  errorController(new AppError('Get my matches is still to be impemented.', 501), res);
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  let user = undefined;
  try {
    user = await User.findByPk(req.params.username);
  } catch (err) {
    errorController(new AppError(`Could not complete your request at this moment!`, 503), res);
    return;
  }
  // const user = await User.findByPk(req.params.username);
  if (!user) {
    errorController(new AppError('Wrong username!', 401), res);
    return;
  }
  if (user.active) {
    errorController(new AppError('User is already activated!', 400), res);
    return;
  }
  user.active = true;
  try {
    await user.save();
  } catch (err) {
    errorController(new AppError(`Account activation failed! Please retry later.`, 503), res);
    return;
  }
  res.status(200).json({ message: 'Your account has been activated successfully.' });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  let user = undefined;
  try {
    user = await User.findOne({ where: { email: email } });
  } catch (err) {
    errorController(new AppError(`Could not complete your request at this moment!`, 503), res);
    return;
  }
  if (!user) {
    errorController(new AppError('No user with that email!', 401), res);
    return;
  }
  if (!user.active) {
    errorController(new AppError('Your profile is not activated!', 400), res);
    return;
  }
  const key = user.username;
  const token = jwt.sign({ key }, process.env.JWT_SECRET);
  const url = `${req.protocol}://${req.get('host')}/resetPassword/${token}`;
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  console.log(user.email, ' asdasd');
  try {
    await user.save();
    sendEmail({
      email: user.email,
      subject: 'Password reset',
      message: `To reset your password, please click the link within the next 10 minutes.
        \n${url}`,
    });
  } catch (err) {
    errorController(new AppError(`Request failed! Try again later.`, 503), res);
    return;
  }
  res.status(200).json({
    message: 'Email has been sent. Check your inbox for password recovery instructions.',
  });
});

exports.resetPassword = catchAsync(async function (req, res, next) {
  let user = undefined;
  try {
    user = await User.findOne({ where: { passwordResetToken: req.params.token } });
  } catch (err) {
    errorController(new AppError(`Could not complete your request at this moment!`, 503), res);
    return;
  }

  if (!user) {
    errorController(new AppError(`No user found, something wen't wrong!`, 404));
    return;
  }
  if (new Date(+Date.now()) > +user.passwordResetExpires) {
    errorController(new AppError('Your password reset link has expired!', 403));
    return;
  }

  if (user && new Date(+Date.now()) < +user.passwordResetExpires) {
    res.status(302).json({
      message: 'Please insert a new password in the highlighted field',
    });
  }
});

exports.passwordRedefined = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.username);
  if (!user.passwordResetToken || !user.passwordResetExpires) {
    errorController(new AppError(`You don't have a password reset request!`, 403));
    return;
  }
  user.password = req.body.newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  if (user.save()) {
    res.status(200).json({
      message: `${req.params.username}, your password has been redefined successfully.`,
    });
  }
});
