const http = require('http');
const app = require('./app');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);

const User = require('././/models/userModel');

io.use(async (socket, next) => {
  const user = await User.findByPk(socket.handshake.headers.user);
  console.log;
  if (user === null || !user.logedIn) {
    next(new Error('invalid'));
  } else {
    next();
  }
});

io.on('connection', (socket) => {
  console.log(
    'Socket connection established!',
    socket.handshake.headers.user,
    socket.id
  );
});
// TODO:
// Handle connection and disconnection to the socket from Users
// Send Challenge Request to another User
// Answer with an error if User challenged is not available
// Answer with Request response when other User handles Request
// Send Error to other User on disconnect
// Send Challenge Response
// Allow a positive or negative response to request
// Answer with an error if User that sent Challenge Request is not available

module.exports = server;
