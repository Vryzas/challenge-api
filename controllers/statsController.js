const catchAsync = require('./../utils/catchAsync');

exports.findStats = catchAsync(async (req, res, next) => {
  const username = req.params.username;
  return res.status(501).json({
    message: `Getting the stats of ${username} is still to be impemented.`,
  });
});

exports.compareStats = catchAsync(async (req, res, next) => {
  const toCompare = req.body.toCompare;
  const compareTo = req.body.compareTo;
  return res.status(501).json({
    message: `Comparing stats with between ${toCompare} and ${compareTo}user is still to be impemented.`,
  });
});
