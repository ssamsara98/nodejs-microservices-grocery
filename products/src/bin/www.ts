#!/usr/bin/env node

/**
 * Module dependencies.
 */
import { createServer } from 'http';
import app from '~/app';
import { env } from '~/config/env.config';
// import { event } from '~/event';
import { db } from '~/infrastructures/db';
import { mq } from '~/infrastructures/mq';
import { debug } from './debug';

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(env.PORT || '4002');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    debug('HTTP server closed');
    await db.mongodb?.disconnect();
    await mq.channel?.close();
  });
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
async function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
async function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  debug('Listening on ' + bind);

  await Promise.all([
    db.connect().then(() => {
      debug('MongoDB connected');
    }),
    mq.connect().then(() => {
      debug('Message Queue connected');
      // return event.subcribe();
    }),
    // .then(() => {
    //   debug('Subscribed to Message Queue');
    // }),
  ]);
}
