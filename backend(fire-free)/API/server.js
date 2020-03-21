const app = require('./src/app');
const http = require('http');
const localStorage = require('./models/localStorage');

// const port = process.env.PORT || 3000;
const port = 80;

app.set('port', port);

const server = http.createServer(app);
const soc_io = require('socket.io');
const io = soc_io(server);

io.on('connection', (socket) => {
    console.log("a user is connected!");
    console.log(localStorage.isLength('NodeData'));
    console.log(JSON.parse(localStorage.getData('NodeData')));
  if (localStorage.isLength('NodeData')) {
    data = JSON.parse(localStorage.getData('NodeData'));
    socket.emit('connected', data);
  } else {
    data = null;
  }
  socket.on('disconnect', () => {
      console.log("a user is disconnected!");
  });
});

// server.listen(port, process.env.SERVER_IP);
server.listen(port);

