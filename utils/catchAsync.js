const errorController = require('./../controllers/errorController');

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      error.status = 'FATAL ERROR';
      errorController(error, req, res, next);
    });
  };
};
