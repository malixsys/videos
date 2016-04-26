#!/usr/bin/env node

/**
 * Module dependencies.
 */
console.log('[SERVER] Loading');

var app = require('./app');

/**
 * Get port from environment and store in Express.
 */

var server,
  port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var useHttps = false;
var start = function() {
  console.log('[SERVER] Starting');
  server.listen(port, onListening);

  server.on('error', onError);
};
if (useHttps) {
  var https = require('https');
  var pem = require('pem');
  pem.createCertificate({days: 90, selfSigned: true}, function (err, keys) {
    server = https.createServer({key: keys.serviceKey, cert: keys.certificate}, app);
    start();
  });
} else {
  var http = require('http');
  server = http.createServer(app);
  start();
}

/**
 * Listen on provided port, on all network interfaces.
 */



;

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

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

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

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

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('[SERVER] Listening on', bind, 'config\n', app.config);
}
