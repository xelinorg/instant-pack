function WebSocket(option) {
  this.sio = option.sio;
  this.sioredis = option.sioredis;
  this.middleware = option.middleware;
  this.transports = option.transports;
  this.logger = option.logger;
  this.listening = false;
  this.isDefaultWired = false;
  this.socket = null;
}

WebSocket.prototype.attach = function webSocketAttach(hserver) {
  this.socket = this.sio(hserver);
  this.socket.set('transports', this.transports);
  if (this.sioredis) {
    this.socket.adapter(this.sioredis);
  }
  if (this.middleware && this.middleware.length > 0) {
    this.socket.use(...this.middleware);
  }
  this.listening = true;
};

WebSocket.prototype.on = function webSocketOn(handler) {
  if (this.listening && !this.isDefaultWired)
    this.socket.on([handler.key], handler.value);
};

WebSocket.prototype.wireDefault = function webSocketWireDefault() {
  if (this.listening && !this.isDefaultWired) {
    this.socket.on('connection', (socketInstance) => {
      this.logger.info(
        'New user connected with headers',
        socketInstance.client.request.headers,
      );

      socketInstance.on('close', (...rest) => {
        this.logger.info('User closed', rest);
      });

      socketInstance.on('*', (packet) => {
        this.logger.debug('packet on*', packet);
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
