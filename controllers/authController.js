const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const catchAsync = require('./../utils/catchAsync');
const errorController = require('./../controllers/errorController');
const AppError = require('./../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  let { username, email, password } = req.body;
  let newUser;
  try {
    newUser = await User.create({
      username: username,
      email: email,
      password: password,
    });
  } catch (error) {
    const val = error.fields.email ? `email` : `username`;
    res.status(401).json({ message: `There's already a user with that ${val} registered on this server!` });
    return;
  }
  const url = `${req.protocol}://${req.get('host')}/user/activation/${newUser.username}`;
  sendEmail({
    email: newUser.email,
    subject: 'Your profile has been created',
    message: `Please click the link to activate your account. 
      If you haven't created a profile please ignore this message.
      \n${url}`,
  });
  res.status(201).json({
    message: 'Your profile has been created, please check your email for the activation message.',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  let user = undefined;
  try {
    user = await User.findByPk(username);
  } catch (err) {
    errorController(new AppError(`Could not complete your request at this moment!`, 503), res);
    return;
  }
  if (!user) {
    errorController(new AppError(`Wrong username!`, 400), res);
    return;
  }
  if (password !== user.password) {
    errorController(new AppError(`Wrong password!`, 400), res);
    return;
  }

  user.logedIn = true;
  try {
    user.save();
  } catch (err) {
    errorController(new AppError(`Could not complete your request at this moment!`, 503), res);
    return;
  }
  res.status(200).json({
    message: 'Login successful.',
    data: { username: user.username, email: user.email },
  });
});

exports.logout = catchAsync(async function (req, res, next) {
  let user = undefined;
  try {
    user = await User.findByPk(req.params.username);
  } catch (err) {
    errorController(new AppError(`Could not complete your request at this moment!`, 503), res);
    return;
  }
  if (!user) {
    errorController(new AppError('No user with this username!', 400), res);
    return;
  }
  if (!user.logedIn) {
    errorController(new AppError(`This user isn't logged in!`, 400), res);
    return;
  }

  user.logedIn = false;
  try {
    user.save();
  } catch (err) {
    errorController(new AppError(`Could not complete your request at this moment!`, 503), res);
    return;
  }
  res.status(200).json({ message: 'Logout successful.' });
});
