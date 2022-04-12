const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await sendEmail({
      email: newUser.email,
      subject: 'Your profile has been created',
      message: `Please click the link to activate your account. 
      If you haven't created a profile please ignore this message.`,
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
