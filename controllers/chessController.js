const catchAsync = require('./../utils/catchAsync');
const axios = require('axios');

exports.player = catchAsync(async (req, res, next) => {
  const player = req.params.player_id;
  const url = `https://api.chess.com/pub/player/${player}/stats`;
  let status;
  let message;
  await axios
    .get(url)
    .then((response) => {
      status = response.status;
      message = response.data.fide || 'No FIDE score for this player found!';
    })
    .catch((error) => {
      status = error.response.status;
      message = error.response.data.message || 'No player with that id found!';
    });
  return await res.status(status).json({
    message: message,
  });
});

exports.playerMatches = catchAsync(async (req, res, next) => {
  const currentDate = new Date().getFullYear() + `/` + ('0' + (new Date().getMonth() + 1)).slice(-2);
  const player = req.params.player_id;
  // if no date is provided, should default to current date
  const date = req.query.date || currentDate;
  const url = `https://api.chess.com/pub/player/${player}/games/${date}`;
  let status;
  let message;
  await axios
    .get(url)
    .then((response) => {
      status = response.status;
      message = `Player ${req.params.player_id} played ${response.data.games.length} games during ${date}.`;
    })
    .catch((error) => {
      status = error.response.status;
      message = error.response.data.message || 'No player with that id found!';
    });
  return await res.status(status).json({
    message: message,
  });
});
