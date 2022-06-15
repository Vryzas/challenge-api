const User = require(`./../models/userModel`);
const { Op } = require('sequelize');
const sequelize = require('./../utils/dbconnection');

const create = async function (options) {
  if (await User.create(options)) {
    return true;
  } else {
    return false;
  }
};

const save = async function (user) {
  if (await user.save()) {
    return true;
  } else {
    return false;
  }
};

const findUser = async function (key) {
  const user = await User.findByPk(key);
  return user;
};

const findByParam = async function (key) {
  const user = await User.findOne({
    where: { [Op.or]: [{ email: key }, { passwordResetToken: key }] },
  });
  return user;
};

const profile = async function (key) {
  const [userProfile, metadata] = await sequelize.query(
    `SELECT u.username, u.email, s.victories, s.draws, s.defeats FROM Users u, Stats s WHERE u.username='${key}' AND s.username='${key}';`
  );
  return userProfile;
};

module.exports = { create, save, findUser, findByParam, profile };
