const User = require('./../models/userModel');

exports.getMe = async function (req, res, next) {
  return res
    .status(501)
    .json({ message: 'Get my data is still to be impemented.' });
};

exports.getMyStats = async function (req, res, next) {
  return res
    .status(501)
    .json({ message: 'Get my statistics is still to be impemented.' });
};

exports.getMyMatches = async function (req, res, next) {
  return res
    .status(501)
    .json({ message: 'Get my matches is still to be impemented.' });
};

exports.activateAccount = async (req, res, next) => {
  // check if user exists and is already activated
  const user = await User.findByPk(req.params.username);
  if (!user || user.active) {
    return res
      .status(400)
      .json({ message: 'Wrong username or user is already activated!' });
  }
  try {
    user.active = true;
    if (await user.save()) {
      return res
        .status(200)
        .json({ message: 'Your account has been activated successfully.' });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'Something went wrong with your activation!' });
  }
};
