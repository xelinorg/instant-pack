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

function configProxy(target, prefix) {
  return new Proxy(target, {
    get: (...rest) => {
      const [prx, prop] = rest;
      if (prop === 'error') {
        return (...toLog) => prx.warn(prefix.concat(':error'), ...toLog);
      }
      if (prop === 'log' || prop === 'info') {
        return (...toLog) => prx.info(prefix.concat(':info'), ...toLog);
      }
      if (prop === 'warn') {
        return (...toLog) => prx.warn(prefix.concat(':warning'), ...toLog);
      }
      if (prop === 'debug') {
        return (...toLog) => prx.debug(prefix.concat(':debug'), ...toLog);
      }
      return Reflect.get(...rest.splice(0, 3));
    },
  });
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
