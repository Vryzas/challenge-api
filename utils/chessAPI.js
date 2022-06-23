const catchAsync = require('./../utils/catchAsync');
const axios = require('axios');

chessStats = catchAsync(async (req, res, type) => {
  console.log(type);
  const player = req.params.player_id;
  let status;
  let message;
  await axios
    .get(process.env.CHESS_API + `${player}/` + type)
    .then((response) => {
      if (type === `stats`) {
        if (!response.data.fide) {
          // if a player exists but has no fide score
          status = 404;
          message = 'No FIDE score for that player found!';
        } else {
          status = 200;
          message = response.data.fide;
        }
      } else if (type === `games/2022/04`) {
        if (response.data.games.length <= 0) {
          // if player has no games played in that period
          status = 404;
          message = 'No games found for that player!';
        } else {
          status = 200;
          message = response.data.games.length;
        }
      }
    })
    .catch((error) => {
      status = 404;
      message = 'No player with that id found!';
    });
  await res.status(status).json({
    message: message,
  });
});

module.exports = chessStats;
