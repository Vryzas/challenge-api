const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => {
  let { username, email, password } = req.body;
  if (!username || !email || !password) {
    (username = null), (email = null), (password = null);
  }
  const key = username;
  const token = jwt.sign({ key }, process.env.JWT_SECRET);
  const newUser = await User.create({
    username: username,
    email: email,
    password: password,
    passwordResetToken: token,
  });
  const url = `${req.protocol}://${req.get('host')}/user/activation/${newUser.passwordResetToken}`;
  sendEmail({
    email: newUser.email,
    subject: 'Your profile has been created',
    message: `Please click the link to activate your account. 
      If you haven't created a profile please ignore this message.
      \n${url}`,
  });
  return res.status(201).json({
    message: 'Your profile has been created, please check your email for the activation message.',
  });
});

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password!' });
  }

  const user = await User.findByPk(username);
  if (!user) {
    return next(new AppError(`Wrong username!`, 400));
  }
  if (password !== user.password) {
    return next(new AppError(`Wrong password!`, 400));
  }
  user.logedIn = true;
  user.save();
  return res.status(200).json({
    message: 'Login successful.',
    data: { username: user.username, email: user.email },
  });
};

exports.logout = catchAsync(async function (req, res, next) {
  const user = await User.findByPk(req.params.username);
  if (!user) {
    return next(new AppError('No user with this username!', 400));
  }
  if (!user.logedIn) {
    return next(new AppError(`This user isn't logged in!`, 400));
  }
  user.logedIn = false;
  user.save();
  return res.status(200).json({ message: 'Logout successful.' });
});
