function WebSocket(option) {
  this.wslib = option.wslib;
  this.middleware = option.middleware;
  this.logger = option.logger;
  this.listening = false;
  this.isDefaultWired = false;
  this.socket = null;
  this.logger = option.logger;
}

WebSocket.prototype.attach = function webSocketAttach(hserver) {
  this.socket = this.wslib(hserver);
  this.socket.use(...this.middleware);
  this.listening = true;
};

WebSocket.prototype.on = function webSocketOn(handler) {
  if (this.listening && !this.isDefaultWired)
    this.socket.on([handler.key], handler.value);
};

WebSocket.prototype.wireDefault = function webSocketWireDefault() {
  if (this.listening && !this.isDefaultWired) {
    this.socket.on('connection', (socketInstance) => {
      this.logger.info('New user connected');

      socketInstance.on('error', (error) => {
        this.logger.error(error);
        setTimeout(() => socketInstance.disconnect(true), 0);
      });

      socketInstance.on('*', (packet) => {
        this.logger.debug(packet);
        this.socket.emit(packet.data[0], packet.data[1]);
      });

      socketInstance.on('disconnect', (reason) => {
        this.logger.info('User disconnected with reason', reason);
      });
    });
    this.isDefaultWired = true;
  }
};

function webSocketFactory(option) {
  return new WebSocket(option);
}

function webSocketConfig(option) {
  return option;
}

module.exports = {
  create: webSocketFactory,
  config: webSocketConfig,
};
