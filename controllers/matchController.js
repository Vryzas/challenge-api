const User = require(`./../models/userModel`);

exports.player = async function (req, res, next) {
  const player = await User.findByPk(req.params.username);
  console.log(player);
  if (!player) {
    return res.status(404).json({
      message: `${req.params.username} does not exist!`,
    });
  }
  return res.status(501).json({
    message: `Find matches for ${player.dataValues.username} is still to be impemented.`,
  });
};

exports.compare = async function (req, res, next) {
  const user1 = await User.findByPk(req.body.username1);
  const user2 = await User.findByPk(req.body.username2);
  if (!user1 || !user2) {
    return res.status(404).json({
      message: `One or both of these users do not exist!`,
    });
  }
  return res.status(501).json({
    message: `Compare matches between ${user1.dataValues.username} and ${user2.dataValues.username} is still to be impemented.`,
  });
};

exports.newMatch = async function (req, res, next) {
  const game = req.body.game;
  const username1 = req.body.username1;
  const username2 = req.body.username2;
  const score1 = req.body.score1;
  const score2 = req.body.score2;
  return res.status(501).json({
    message: `Add a ${game} match between ${username1} and ${username2} is still to be implemented`,
  });
};
