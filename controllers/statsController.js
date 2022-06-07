const catchAsync = require('./../utils/catchAsync');
const Stat = require('./../models/statsModel');

exports.findStats = catchAsync(async (req, res, next) => {
  const userStats = await Stat.findByPk(req.params.username);
  if (!userStats) {
    return res.status(404).json({
      message: `No player with username ${req.params.username} found!`,
    });
  }
  return res.status(200).json({
    message: userStats,
  });
});

exports.compareStats = catchAsync(async (req, res, next) => {
  const usernames = [req.body.username1, req.body.username2, req.body.username3, req.body.username4];
  const stats = await Stat.findAll({
    where: {
      username: usernames,
    },
  });
  return res.status(200).json({
    message: stats,
  });
});
