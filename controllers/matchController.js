const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Match = require('./../models/matchModel');
const User = require(`./../models/userModel`);
const { Op } = require('sequelize');

exports.playerMatches = catchAsync(async function (req, res, next) {
  const player = await User.findByPk(req.params.username);
  if (!player) {
    return next(new AppError(`No player with that username found!`, 400));
  }
  const games = await Match.findAll({
    where: {
      [Op.or]: [{ username1: req.params.username }, { username2: req.params.username }],
    },
  });
  return res.status(200).json({
    message: games.length,
    games: games,
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
