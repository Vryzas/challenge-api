const catchAsync = require('./../utils/catchAsync');
const axios = require('axios');
const errorController = require('./../controllers/errorController');
const AppError = require('./../utils/appError');

exports.chessPlayer = catchAsync(async (req, res, next) => {
  const player = req.body.player;
  const url = `https://api.chess.com/pub/player/${player}/stats`;
  await axios
    .get(url)
    .then((response) => {
      if (response.data.fide) {
        return res.status(200).json({
          message: response.data.fide,
        });
      } else {
        // if a player exists but has no fide score
        return errorController(new AppError('No FIDE score for that player found!', 404), res);
      }
    })
    .catch((error) => {
      return errorController(new AppError('No player with that id found!', 404), res);
    });
});

exports.chessMatchesByPlayer = catchAsync(async (req, res, next) => {
  const player = req.body.player;
  const url = `https://api.chess.com/pub/player/${player}/games/2022/06`;
  let status;
  let message;
  await axios
    .get(url)
    .then((response) => {
      if (response.data.games.length > 0) {
        return res.status(200).json({
          message: response.data.games.length,
        });
      } else {
        // if player has no games played in that period
        return errorController(new AppError('No games found for that player!', 404), res);
      }
    })
    .catch((error) => {
      return errorController(new AppError('No player with that id found!', 404), res);
    });
});
