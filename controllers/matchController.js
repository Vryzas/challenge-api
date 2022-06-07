const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Match = require('./../models/matchModel');
const User = require(`./../models/userModel`);
const Stat = require(`./../models/statsModel`);
const { Op } = require('sequelize');
const lodash = require('lodash');

// receives the array of matches a user has played
const getTotalScore = (games, user) => {
  // lodash.sum computes the sum of the values of an array
  const score = lodash.sum(
    // array.map returns an array of values wich fulfil the condition
    // without changing the original
    games.map((val) => {
      return user === val.username1 ? val.score1 : val.score2;
    })
  );
  return score;
};

exports.playerMatches = catchAsync(async function (req, res, next) {
  const player = await User.findByPk(req.params.username);
  if (!player) {
    return next(new AppError(`No player with that username found!`, 400));
  }
  // returns the array of matches played by the given player
  const playerGames = await Match.findAll({
    where: {
      [Op.or]: [{ username1: req.params.username }, { username2: req.params.username }],
    },
  });
  return res.status(200).json({
    message: `Player ${player.username} played ${playerGames.length} matches.`,
    data: playerGames,
  });
});

exports.compareMatches = catchAsync(async function (req, res, next) {
  //returns an array with the matches featuring only the given players
  const gamesUsers = await Match.findAll({
    // finds games where username1 vs username2 OR username2 vs username1
    where: {
      [Op.or]: [
        { username1: req.body.username1, username2: req.body.username2 },
        { username1: req.body.username2, username2: req.body.username1 },
      ],
    },
  });
  if (gamesUsers.length === 0) {
    return res.status(404).json({ message: `No games found between these players!` });
  }
  // will get the total score of each player
  const user1Score = getTotalScore(gamesUsers, req.body.username1);
  const user2Score = getTotalScore(gamesUsers, req.body.username2);

  return res.status(200).json({
    message: `${req.body.username1} and ${req.body.username2} played a total of ${gamesUsers.length} matches.
      ${req.body.username1} scored a total of ${user1Score} points and ${req.body.username2} scored atotal of ${user2Score} points.`,
    data: gamesUsers,
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
  if (req.body.score1 === req.body.score2) {
    await Stat.increment(
      { draws: 1 },
      {
        where: {
          [Op.or]: [{ username: req.body.username1 }, { username: req.body.username2 }],
        },
      }
    );
  }
  if (req.body.score1 > req.body.score2) {
    await Stat.increment(
      { victories: 1 },
      {
        where: { username: req.body.username1 },
      }
    );
    await Stat.increment(
      { defeats: 1 },
      {
        where: { username: req.body.username2 },
      }
    );
  }
  if (req.body.score1 < req.body.score2) {
    await Stat.increment(
      { victories: 1 },
      {
        where: { username: req.body.username2 },
      }
    );
    await Stat.increment(
      { defeats: 1 },
      {
        where: { username: req.body.username1 },
      }
    );
  }

  return res.status(201).json({
    message: `Game saved successfully.`,
  });
});
