/* eslint-disable no-restricted-syntax */
const net = require('net');

const socketTable = [];
const clients = {};
const server = net.createServer((socket) => {
  console.log('client connected');
  socketTable.push(socket);

  socket.on('data', (data) => {
    const result = data.toString().trim();
    const regExp = result.match(/^(#\d{5})/igm);

    if (regExp) {
      const str2 = result.split(regExp).join('').trim();
      const regExp2 = result.match(/(\d{5})/igm)[0];

      if (clients[regExp2]) {
        const privateMessage = {
          id: socket.remotePort,
          message: str2,
        };
        clients[regExp2].write(JSON.stringify(privateMessage));
      } else {
        socket.write(JSON.stringify('This client is undefined'));
      }
    } else if (/^Hello$/ig.test(result)) {
      process.stdout.write('World\n');
    } else if (result === 'end' && socketTable !== 0) {
      socketTable.pop();
      if (socketTable.length === 0) {
        server.close();
      }
    } else if (/^users$/ig.test(result)) {
      const usersList = Object.keys(clients).filter(key => key.toString() !== socket.remotePort.toString());
      socket.write(JSON.stringify(usersList));
    } else {
      // eslint-disable-next-line guard-for-in
      for (const key in clients) {
        const obj = {
          id: socket.remotePort,
          message: result,
        };
        if (clients[key] !== socket) {
          clients[key].write(JSON.stringify(obj));
        }
      }
    }
  });
});

server.listen({
  host: '127.0.0.1',
  port: 8080,
  exclusive: true,
});

server.on('connection', (socket) => {
  clients[socket.remotePort] = socket;
});
