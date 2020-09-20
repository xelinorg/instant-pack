const sio = require('socket.io');
const redis = require('socket.io-redis');
const https = require('https');
const http = require('http');
const siowildcard = require('socketio-wildcard')();

const instant = require('./src');

if (process.argv.length > 2) {
  const saneOption = instant.parseOption(
    process.argv.splice(2, process.argv.length),
  );
  const config = {
    ...saneOption,
    sio,
    redis,
    transports: ['websocket'],
    hlib: saneOption.secure ? https : http,
    middleware: [siowildcard],
  };
  instant.boot(config);
} else {
  module.exports = instant;
}
