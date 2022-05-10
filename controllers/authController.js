const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const url = `${req.protocol}://${req.get('host')}/activateMe/${newUser.username}`;
    await sendEmail({
      email: newUser.email,
      subject: 'Your profile has been created',
      message: `Please click the link to activate your account. 
      If you haven't created a profile please ignore this message.
      \n${url}`,
    });
    return res.status(201).json({
      message: 'Your profile has been created, please check your email for the activation message.',
    });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password!' });
    }

    const user = await User.findByPk(username);
    if (!user || password !== user.password) {
      return res.status(401).json({ message: 'Wrong username or password!' });
    }
    if (user.loggedIn) {
      return res.status(400).json({ message: 'User already logged in' });
    }
    user.loggedIn = true;
    user.save();
    return res.status(200).json({
      message: 'Login successful.',
      data: { username: user.username, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.logout = async function (req, res, next) {
  const user = await User.findByPk(req.params.username);
  if (!user) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
  if (!user.loggedIn) {
    return res.status(500).json({ message: `This user isn't logged in!` });
  }
  user.loggedIn = false;
  user.save();
  return res.status(200).json({ message: 'Logout successful.' });
};
