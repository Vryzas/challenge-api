const User = require('./../models/userModel');

exports.activeUser = async (req, res, next) => {
  let user;
  if (req.params.username || req.body.username) {
    user = await User.findByPk(req.params.username || req.body.username);
    if (!user) {
      return res.status(404).json({ message: 'No registered user with that username!' });
    }
  }
  if (req.body.email) {
    user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: 'No registered user with that email!' });
    }
  }
  if (!user) {
    return res.status(400).json({ message: 'No user data provided!' });
  }
  if (!user.active) {
    return res.status(401).json({ message: `This account hasn't been activated yet!` });
  }
  next();
};
