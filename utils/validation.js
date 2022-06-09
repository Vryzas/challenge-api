const emailVal = (email) => {
  const format =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(format);
};

exports.signupFields = (req, res, next) => {
  let ret = {};
  if (!req.body.username) {
    ret.message = `No username provided!`;
    ret.status = 400;
  } else if (!req.body.email) {
    ret.message = 'No email provided!';
    ret.status = 400;
  } else if (!emailVal(req.body.email)) {
    ret.message = 'Invalid email!';
    ret.status = 400;
  } else if (!req.body.password) {
    ret.message = 'No password provided!';
    ret.status = 400;
  } else {
    ret.message = ``;
    ret.status = 200;
  }

  if (ret.status === 200) {
    next();
  } else {
    res.status(ret.status).json({ message: ret.message });
  }
};

exports.loginFields = (req, res, next) => {
  let check = false;
  const ret = {};
  if (!req.body.username) {
    ret.message = 'No username provided!';
    ret.status = 400;
    check = true;
  } else if (!req.body.password) {
    ret.message = 'No password provided!';
    ret.status = 400;
    check = true;
  }
  if (!check) {
    next();
  } else {
    res.status(ret.status).json({ message: ret.message });
  }
};
