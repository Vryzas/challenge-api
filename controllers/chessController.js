const catchAsync = require('./../utils/catchAsync');
const axios = require('axios');

exports.chessPlayer = catchAsync(async (req, res, next) => {
  const player = req.body.player;
  const url = `https://api.chess.com/pub/player/${player}/stats`;
  let status;
  let message;
  await axios
    .get(url)
    .then((response) => {
      status = response.status;
      message = response.data.fide || 'No data about that player found!';
    })
    .catch((error) => {
      status = error.response.status;
      message = error.response.data.message || 'No player with that id found!';
    });
  return await res.status(status).json({
    message: message,
  });
});

exports.chessMatchesByPlayer = catchAsync(async (req, res, next) => {
  const player = req.body.player;
  const url = `https://api.chess.com/pub/player/${player}/games/2022/04`;
  let status;
  let message;
  await axios
    .get(url)
    .then((response) => {
      status = response.status;
      message = {
        games: response.data.games.length || 'No games from that player found!',
      };
    })
    .catch((error) => {
      status = error.response.status;
      message = error.response.data.message || 'No player with that id found!';
    });
  return await res.status(status).json({
    message: message,
  });
});
