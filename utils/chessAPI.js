const axios = require('axios');

chessStats = async (req, res, type) => {
  const player = req.params.player_id;
  let status;
  let message;
  await axios
    .get(process.env.CHESS_API + `${player}/` + type)
    .then((response) => {
      status = response.status;
      message = response.data.fide || Object.keys(response.data.games).length;
    })
    .catch((error) => {
      console.log(error);
      return (
        (status = 500),
        (message = `There has been an error or that player doesn't exist!`)
      );
    });
  return await res.status(status).json({
    message: message,
  });
};

module.exports = chessStats;
