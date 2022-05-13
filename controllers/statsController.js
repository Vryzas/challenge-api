const catchAsync = require('./../utils/catchAsync');
const Stat = require('./../models/statsModel');

exports.findStats = catchAsync(async (req, res, next) => {
  if (!req.params.username) {
    return res.status(400).json({ message: `No player name given!` });
  }
  const userStats = await Stat.findByPk(req.params.username);
  if (!userStats) {
    return res.status(404).json({ message: `No player with that name found!` });
  }
  return res.status(200).json({
    message: userStats,
  });
});

exports.compareStats = catchAsync(async (req, res, next) => {
  const usernames = [req.query.username1, req.query.username2, req.query.username3, req.query.username4].filter(
    (val) => {
      if (val !== undefined) return val;
    }
  );
  if (usernames.length <= 1) {
    return res.status(400).json({
      message: 'You need at least 2 players to compare!',
    });
  }
  const stats = await Stat.findAll({
    where: {
      username: usernames,
    },
  });
  if (stats.length === 0) {
    return res.status(404).json({
      message: 'No stats found for the players names inserted!',
    });
  }
  if (stats.length === 1) {
    return res.status(206).json({
      alert: `Can't compare! Only found the statistics from ${stats[0].dataValues.username}!`,
      message: stats,
    });
  }
  return res.status(200).json({
    message: stats,
  });
});
