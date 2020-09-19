function WebServer (option) {
  this.hserver = option.hlib.createServer(option.hhandler)
  this.logger = option.logger
}

WebServer.prototype.addSocket = function webServerAddSocket (target) {
  target.attach(this.hserver)
  target.wireDefault()
}

WebServer.prototype.boot = function webServerBoot (port) {
  this.hserver.listen(port)
  this.logger.info('listening on port '.concat(port))
}

function webServerFactory (option) {
  return new WebServer(option)
}

function webServerConfig (option) {
  return {
    ...option,
    hhandler: function (req, res) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Content-Length', Buffer.byteLength('artsteps-instant'))
      res.end('artsteps-instant')
    }
  }
}

module.exports = {
  create: webServerFactory,
  config: webServerConfig
}
