const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Match = require('./../models/matchModel');
const User = require(`./../models/userModel`);
const sequelize = require('../utils/dbconnection');
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

// increments the 'column' (draws, victories or defeats) for a given 'player'
const statIncrement = async function (player, column) {
  await sequelize.query(`UPDATE Stats
  SET ${column}= ${column}+1
  WHERE username='${player}'`);
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
      ${req.body.username1} scored a total of ${user1Score} points and ${req.body.username2} scored a total of ${user2Score} points.`,
    data: gamesUsers,
  });
});

exports.addMatch = catchAsync(async function (req, res, next) {
  if (req.body.username1 === req.body.username2) {
    return next(new AppError(`Cannot save game! Username is the same on both players!`, 400));
  }
  const newGame = await Match.create({
    game: req.body.game,
    username1: req.body.username1,
    username2: req.body.username2,
    score1: req.body.score1,
    score2: req.body.score2,
  });
  // updates the players stats
  if (req.body.score1 === req.body.score2) {
    // draws+1 for both players
    await statIncrement(req.body.username1, 'draws');
    await statIncrement(req.body.username2, 'draws');
  }
  if (req.body.score1 > req.body.score2) {
    // victory+1 player1, defeat+1 player2
    await statIncrement(req.body.username1, 'victories');
    await statIncrement(req.body.username2, 'defeats');
  }
  if (req.body.score1 < req.body.score2) {
    // defeat+1 player1, victory+=sername1, 'defeats');
    await statIncrement(req.body.username2, 'victories');
  }

  return res.status(201).json({
    message: `Game saved successfully.`,
  });
});
