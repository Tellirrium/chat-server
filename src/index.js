const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
let counter = 0;

const port = 4000;

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const { User, Message } = require('./sequelize');


server.listen(port, () => console.log(`Server listen port ${port}`));

const connections = [];

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('client connected');

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('client disconnected');
  });

  socket.on('message', (data) => {
    const time = (new Date()).toLocaleTimeString();
    console.log(data);

    // eslint-disable-next-line no-unused-vars
    User.findOne({ where: { name: `${data.name}` } }).then((user) => {
      Message.create({
        text: data.message,
        userId: user.id,
      });

      const userInfo = {
        name: user.name,
        src: user.picture,
      };

      connections.forEach((client) => {
        client.json.send({
          text: data.message, time, person: userInfo,
        });
      });
    });
  });
});

app.post('/auth', (req, res) => {
  const user = {
    name: req.body.data.name,
    src: req.body.data.imageUrl,
  };

  User.findOne({ where: { email: `${req.body.data.email}` } }).then((client) => {
    if (!client) {
      const userForBd = {
        email: req.body.data.email,
        name: req.body.data.name,
        picture: req.body.data.imageUrl,
        password: 'none',
      };

      console.log(userForBd);
      console.log(user);

      User.create(userForBd);
    }
  });

  res.send(user);
});

app.post('/searchUser', (req, res) => {
  User.findOne({ where: { email: `${req.body.userInfo.email}` } }).then((user) => {
    if (user) {
      if (user.password === req.body.userInfo.password) {
        res.send({
          name: user.name,
          src: user.picture,
        });
      } else {
        res.send({
          message: 'Wrong password',
        });
      }
    } else {
      res.send({
        message: 'error',
      });
      console.log('пользователь не найден');
    }
  });
});

app.post('/registration', (req, res) => {
  console.log(req.body.user);
  User.findOne({ where: { email: `${req.body.user.email}` } }).then((user) => {
    if (user) {
      res.send({
        message: 'error',
      });
    } else {
      User.create({
        email: req.body.user.email,
        name: req.body.user.name,
        password: req.body.user.password,
        picture: 'https://pp.userapi.com/c639219/v639219533/5bd44/aBlKArq3tMM.jpg',
      });
      console.log('пользователь создан');
      res.send({
        message: 'successful',
      });
    }
  });
});

app.post('/showUsers', (req, res) => {
  User.findAll().then((users) => {
    res.send(users);
  });
});
