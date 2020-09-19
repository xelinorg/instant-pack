const instant = require('./src')

if (process.argv.length > 2) {
  const saneOption = instant.parseOption(process.argv.splice(2, process.argv.length))
  const config = {
    ...saneOption,
    wslib: require('socket.io'),
    hlib: saneOption.secure ? require('https') : require('http'),
    middleware: [require('socketio-wildcard')()]
  }
  instant.boot(config)
} else {
  module.exports = instant
}
