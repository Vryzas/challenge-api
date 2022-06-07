const chessStats = require('./../utils/chessAPI');

exports.player = async (req, res) => {
  type = `stats`;
  chessStats(req, res, type);
};

exports.playerMatches = async (req, res) => {
  type = `games/2022/04`;
  chessStats(req, res, type);
};
