const catchAsync = require('./../utils/catchAsync');
const Stat = require('./../models/statsModel');

exports.findStats = catchAsync(async (req, res, next) => {
  const userStats = await Stat.findByPk(req.params.username);
  if (!userStats) {
    return res.status(404).json({ message: `No player with that name found!` });
  }
  return res.status(200).json({
    message: userStats,
  });
});

exports.compareStats = catchAsync(async (req, res, next) => {
  const toCompare = req.body.toCompare;
  const compareTo = req.body.compareTo;
  return res.status(501).json({
    message: `Comparing stats with between ${toCompare} and ${compareTo}user is still to be impemented.`,
  });
});
