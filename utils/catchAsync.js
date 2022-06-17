const errorController = require('./../controllers/errorController');

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      errorController(error, req, res, next);
    });
  };
};
