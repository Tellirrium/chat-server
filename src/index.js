/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-extraneous-dependencies
const Websocket = require('ws');

const server = new Websocket.Server({ port: 4000 });
const arrayOfClients = [];

server.on('connection', (socket) => {
  console.log('client connected');
  arrayOfClients.push(socket);

  socket.on('message', (data) => {
    if (data === 'end') {
      socket.close();
      if (arrayOfClients.every(client => client.readyState !== Websocket.OPEN)) {
        server.close();
      }
    } else {
      server.clients.forEach((client) => {
        if (client.readyState === Websocket.OPEN) {
          client.send(data);
        }
      });
    }
  });
});
