const webServer = require('./web-server')
const webSocket = require('./web-socket')
const config = require('./config')

function boot (option) {
  const bootConfig = config(option)
  const webServerConfig = webServer.config(bootConfig.webServer)
  const webSocketConfig = webSocket.config(bootConfig.webSocket)
  const serviceInstance = webServer.create(webServerConfig)
  serviceInstance.addSocket(webSocket.create(webSocketConfig))
  serviceInstance.boot(bootConfig.ensurePort(option))
  return serviceInstance
}

function parseOption (option) {
  return option.reduce((acc, cur) => ({ ...acc, ...(cur.indexOf('=') > 0 && cur.indexOf('=') < cur.length - 1 ? { [cur.split('=')[0]]: cur.split('=')[1] } : {}) }), {})
}

module.exports = {
  webServer,
  webSocket,
  config,
  boot,
  parseOption
}
