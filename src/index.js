const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const port = 4000;

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(port, () => console.log(`Server listen port ${port}`));

const users = [];
const connections = [];

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('client connected');
  // console.log(socket.id);

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('client disconnected');
  });

  socket.on('message', (data) => {
    const time = (new Date()).toLocaleTimeString();

    connections.forEach((client) => {
      client.json.send({
        event: 'message', text: data, time, id: socket.id,
      });
    });
  });
});

app.post('/auth', (req, res) => {
  const token = jwt.decode(req.body.data);
  res.send(token);
});

// const server = require('socket.io').listen(4000);

// const clients = [];

// // server.set('log level', 1);

// server.sockets.on('connection', (socket) => {
//   console.log('client connected');
//   clients.push(socket);

//   const ID = (socket.id).toString().substr(0, 5);

//   // const time = (new Date).toLocaleTimeString();

//   // // Посылаем клиенту сообщение о том, что он успешно подключился и его имя
//   // socket.json.send({'event': 'connected', 'name': ID, 'time': time});
//   // // Посылаем всем остальным пользователям, что подключился новый клиент и его имя
//   // socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});

//   socket.on('message', (data) => {
//     const time = (new Date()).toLocaleTimeString();

//     clients.forEach((client) => {
//       client.json.send({
//         event: 'messageReceived', name: ID, text: data, time,
//       });
//     });
//   });

//   socket.on('disconnect', () => {
//     const time = (new Date()).toLocaleTimeString();

//     server.sockets.json.send({ event: 'userSplit', name: ID, time });
//   });
// });
