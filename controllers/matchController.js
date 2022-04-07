exports.playerMatches = async function (req, res, next) {
  const player = req.params.username;
  return res.status(501).json({
    message: `Find matches for ${player} is still to be impemented.`,
  });
};

exports.compareMatches = async function (req, res, next) {
  const compareTo = req.params.compareTo;
  const me = req.body.username;
  return res.status(501).json({
    message: `Compare matches between ${me} and ${compareTo} is still to be impemented.`,
  });
};

exports.addMatch = async function (req, res, next) {
  const game = req.body.game;
  const username1 = req.body.username1;
  const username2 = req.body.username2;
  const score1 = req.body.score1;
  const score2 = req.body.score2;
  return res
    .status(501)
    .json({
      message: `Add a ${game} match between ${username1} and ${username2} is still to be implemented`,
    });
};
