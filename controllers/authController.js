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
    return res.status(401).json({ message: `There's already a user with that ${val} registered on this server!` });
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
  const user = await User.findByPk(username);

  if (!user) {
    return errorController(new AppError(`Wrong username!`, 400), res);
  }
  if (password !== user.password) {
    return errorController(new AppError(`Wrong password!`, 400), res);
  }

  user.logedIn = true;
  user.save();
  res.status(200).json({
    message: 'Login successful.',
    data: { username: user.username, email: user.email },
  });
});

exports.logout = catchAsync(async function (req, res, next) {
  const user = await User.findByPk(req.params.username);
  if (!user) {
    return errorController(new AppError('No user with this username!', 400), res);
  }
  if (!user.logedIn) {
    return errorController(new AppError(`This user isn't logged in!`, 400), res);
  }
  user.logedIn = false;
  user.save();
  res.status(200).json({ message: 'Logout successful.' });
});
