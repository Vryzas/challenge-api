const Stat = require(`./../models/statsModel`);

const create = async function (options) {
  if (await Stat.create(options)) {
    return true;
  } else {
    return false;
  }
};

const save = async function (stat) {
  if (await stat.save()) {
    return true;
  } else {
    return false;
  }
};

const findStat = async function (username) {
  const stat = await Stat.findByPk(username);
  return stat;
};

module.exports = { create, save, findStat };
