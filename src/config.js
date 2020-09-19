let configInstance;

function portCheck(option) {
  if (typeof option !== 'number' || option <= 1024 || option > 65535)
    return Math.floor(Math.random() * (65535 - 1024) + 1024);
  return option;
}

function ensurePort(option, log) {
  const requestedPort = parseInt(option.port, 10);
  const sanePort = portCheck(requestedPort);
  if (requestedPort !== sanePort)
    log.warn(
      'requested port '.concat(
        requestedPort,
        ' is unavailable, will bind on port ',
        sanePort,
      ),
    );
  return sanePort;
}

function logHandler(prefix) {
  return {
    set: (...rest) => {
      const [target, prop] = rest;
      if (prop === 'error') {
        return target.error(prefix.concat(':error'), ...rest);
      }
      if (prop === 'log' || prop === 'info') {
        return target.info(prefix.concat(':info'), ...rest);
      }
      if (prop === 'warn') {
        return target.warn(prefix.concat(':warning'), ...rest);
      }
      return Reflect.set(...rest);
    },
  };
}

function configProxy(target, prefix) {
  return new Proxy(target, logHandler(prefix));
}

function logWire(prefix, logger) {
  return typeof logger === 'object' && typeof logger.error === 'function'
    ? configProxy(logger, prefix)
    : configProxy(console, prefix);
}

function configFactory(option) {
  configInstance = {
    webServer: {
      logger: logWire('web-server', option.logger),
      hlib: option.hlib,
      hhandler: option.hhandler,
    },
    webSocket: {
      logger: logWire('web-socket', option.logger),
      wslib: option.wslib,
      middleware: option.middleware,
    },
    ensurePort: (portOption) => {
      return ensurePort(portOption, logWire('web-server', option.logger));
    },
  };
  return Object.seal(configInstance);
}

module.exports = function config(option) {
  return configInstance || configFactory(option);
};
