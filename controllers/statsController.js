exports.winUpdate = async (req, res, next) => {
  const winner = req.params.username;
  return res.status(501).json({
    message: 'Updating user victories is still to be impemented.' + `${winner}`,
  });
};

exports.defeatUpdate = async (req, res, next) => {
  const loser = req.params.username;
  return res.status(501).json({
    message: 'Updating user defeats is still to be impemented.' + `${loser}`,
  });
};

exports.drawUpdate = async (req, res, next) => {
  const draw = req.params.username;
  return res
    .status(501)
    .json({ message: 'Updating draws is still to be impemented.' + `${draw}` });
};

exports.findStats = async (req, res, next) => {
  const username = req.params.username;
  return res.status(501).json({
    message: `Getting the stats of ${username} is still to be impemented.`,
  });
};

exports.compareStats = async (req, res, next) => {
  const toCompare = req.body.toCompare;
  const compareTo = req.body.compareTo;
  return res.status(501).json({
    message: `Comparing stats with between ${toCompare} and ${compareTo}user is still to be impemented.`,
  });
};
