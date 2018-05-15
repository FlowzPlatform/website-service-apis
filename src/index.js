/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const port = app.get('port');
const http = require('http');
// const server = app.listen(port);
const wsPort = process.env.socket_port || 4032

const socketServer = http.createServer().listen(wsPort);
app.setup(socketServer);
const server = http.createServer(app).listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(`Feathers application started on ${app.get('host')}:${port}`)
);
