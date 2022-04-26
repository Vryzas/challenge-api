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

  socket.on('challenge', (args) => {
    if (usersOnline.some((user) => user.includes(args.to))) {
      const sender = usersOnline.find((user) => user.includes(args.to));
      sender[1].emit(
        `onChallenge`,
        `${args.from} is challenging you: \n${args.text}`
      );
    } else {
      socket.emit(`Error`, `${args.to} appears to be offline or unavailable!`);
    }
  });

  socket.on(`response`, (args) => {
    if (usersOnline.some((user) => user.includes(args.to))) {
      const sender = usersOnline.find((user) => user.includes(args.to));
      sender[1].emit(
        `onResponse`,
        `${args.from} is answering to your challenge: \n${args.text}`
      );
    } else {
      socket.emit(`Error`, `${args.to} is no longer online or is unavailable!`);
    }
  });

  socket.on('disconnect', (socket) => {
    console.log(`${user} has disconnected!`);
    io.emit('onDisconnect', `${user} disconnected!`);
    usersOnline = usersOnline.filter((val) => val[0] !== user);
    usersOnline.forEach((val) => console.log(val[0]));
  });
});

module.exports = server;
