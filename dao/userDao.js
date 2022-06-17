const User = require(`./../models/userModel`);
const { Op } = require('sequelize');
const sequelize = require('./../utils/dbconnection');

// creates a new user on DB with the passed 'options'
const create = async function (options) {
  if (await User.create(options)) {
    return true;
  } else {
    // returns false in case of DB failure
    return false;
  }
};

// saves the 'user' instance on the DB
const save = async function (user) {
  if (await user.save()) {
    return true;
  } else {
    return false;
  }
};

// finds a user by it's primary key (username)
const findUser = async function (username) {
  const user = await User.findByPk(username);
  return user;
};

// finds a user by a given parameter (the email OR the passwordResetToken)
const findByParam = async function (parameter) {
  const user = await User.findOne({
    where: { [Op.or]: [{ email: parameter }, { passwordResetToken: parameter }] },
  });
  return user;
};

// returns the user data and stats
const profile = async function (username) {
  // sequelize custom querys return 2 arrays, only userProfile is used
  const [userProfile, metadata] = await sequelize.query(
    `SELECT u.username, u.email, s.victories, s.draws, s.defeats FROM Users u, Stats s WHERE u.username='${username}' AND s.username='${username}';`
  );
  return userProfile[0];
};

module.exports = { create, save, findUser, findByParam, profile };
