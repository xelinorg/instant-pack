const defaultHttpResponse = 'instant-pack';
function WebServer(option) {
  this.hserver = option.hlib.createServer(option.hhandler);
  this.logger = option.logger;
}

WebServer.prototype.addSocket = function webServerAddSocket(target) {
  target.attach(this.hserver);
  target.wireDefault();
};

WebServer.prototype.boot = function webServerBoot(port) {
  this.hserver.listen(port);
  this.logger.info('listening on port '.concat(port));
};

function webServerFactory(option) {
  return new WebServer(option);
}

function webServerConfig(option) {
  return {
    ...option,
    hhandler: (req, res) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Length', Buffer.byteLength(defaultHttpResponse));
      res.end(defaultHttpResponse);
    },
  };
}

module.exports = {
  create: webServerFactory,
  config: webServerConfig,
};
