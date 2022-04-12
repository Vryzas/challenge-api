const User = require('./../models/userModel');

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(201).json({
      message:
        'Your profile has been created, please check your email for the activation message.',
    });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.login = async function (req, res, next) {
  return res.status(501).json({ message: 'Login is still to be impemented.' });
};

exports.logout = async function (req, res, next) {
  return res.status(501).json({ message: 'Logout is still to be impemented.' });
};
