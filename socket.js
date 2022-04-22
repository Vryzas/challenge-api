const http = require('http');
const app = require('./app');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);

const User = require('././/models/userModel');

let usersOnline = [];

io.use(async (socket, next) => {
  const user = await User.findByPk(socket.handshake.headers.user);
  if (user === null || !user.logedIn) {
    next(new Error(`Invalid credentials or not loged in!`));
  } else {
    usersOnline.push([user.username, socket]);
    next();
  }
});

io.on('connection', (socket) => {
  const user = socket.handshake.headers.user;
  socket.broadcast.emit('onConnect', `${user} is online!`);

  socket.on('disconnect', (socket) => {
    console.log(`${user} has disconnected!`);
    io.emit('onDisconnect', `${user} disconnected!`);
    usersOnline = usersOnline.filter((val) => val[0] !== user);
    usersOnline.forEach((val) => console.log(val[0]));
  });
});

// TODO:
// Send Challenge Request to another User
// Answer with an error if User challenged is not available
// Answer with Request response when other User handles Request
// Send Error to other User on disconnect
// Send Challenge Response
// Allow a positive or negative response to request
// Answer with an error if User that sent Challenge Request is not available

module.exports = server;
