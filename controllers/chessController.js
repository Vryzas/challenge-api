const axios = require('axios');

exports.chessPlayer = async (req, res, next) => {
  const player = req.body.player;
  const url = `https://api.chess.com/pub/player/${player}/stats`;
  let status;
  let message;
  await axios
    .get(url)
    .then((response) => {
      status = response.status;
      message = response.data.fide;
    })
    .catch((error) => {
      status = 500;
      console.log(error);
    });
  return await res.status(500).json({
    message: message,
  });
};

exports.chessMatchesByPlayer = async (req, res, next) => {
  const player = req.body.player;
  const url = `https://api.chess.com/pub/player/${player}/games/2022/04`;
  let status;
  let message;
  await axios
    .get(url)
    .then((response) => {
      status = response.status;
      message = {
        games: response.data.games,
      };
    })
    .catch((error) => {
      status = 500;
      console.log(error);
    });
  return await res.status(status).json({
    message: message.games.length,
  });
};
