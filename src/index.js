/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-extraneous-dependencies
const Websocket = require('ws');

const server = new Websocket.Server({ port: 3000 });

server.on('connection', (socket) => {
  console.log('client connected');

  socket.on('message', (data) => {
    if (data === 'end') {
      socket.close();
    } else {
      server.clients.forEach((client) => {
        if (client.readyState === Websocket.OPEN) {
          client.send(data);
        }
      });
    }
  });
});
