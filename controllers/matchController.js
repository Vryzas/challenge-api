const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Match = require('./../models/matchModel');

exports.playerMatches = catchAsync(async function (req, res, next) {
  const player = req.params.username;
  return res.status(501).json({
    message: `Find matches for ${player} is still to be impemented.`,
  });
});

exports.compareMatches = catchAsync(async function (req, res, next) {
  const compareTo = req.params.compareTo;
  const me = req.body.username;
  return res.status(501).json({
    message: `Compare matches between ${me} and ${compareTo} is still to be impemented.`,
  });
});

exports.addMatch = catchAsync(async function (req, res, next) {
  if (req.body.username1 === req.body.username2) {
    return next(new AppError(`Save game fail! Same username on both players!?`, 400));
  }
  const newGame = await Match.create({
    game: req.body.game,
    username1: req.body.username1,
    username2: req.body.username2,
    score1: req.body.score1,
    score2: req.body.score2,
  });
  return res.status(201).json({
    message: `Game saved successfully.`,
  });
});
