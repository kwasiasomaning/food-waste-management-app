'use strict';

/**
 * Metro/Expo `listen(port)` with no host binds IPv6 `::` only.
 * Cursor Browser / port-forward scans IPv4 sockets, so force 0.0.0.0.
 * Pair with ipv6-loopback-proxy.cjs so ::1 still works.
 */
const net = require('net');

const originalListen = net.Server.prototype.listen;

function shouldForceIpv4(host) {
  return (
    host == null ||
    host === '' ||
    host === 'localhost' ||
    host === '::' ||
    host === '[::]'
  );
}

net.Server.prototype.listen = function listenWithIpv4(...args) {
  const first = args[0];

  if (first && typeof first === 'object' && !Array.isArray(first) && first.fd == null) {
    if (shouldForceIpv4(first.host) && first.path == null) {
      args[0] = { ...first, host: '0.0.0.0' };
    }
    return originalListen.apply(this, args);
  }

  const port = first;
  if (typeof port === 'number' || (typeof port === 'string' && /^\d+$/.test(port))) {
    const second = args[1];
    if (typeof second === 'function' || second === undefined) {
      args.splice(1, 0, '0.0.0.0');
    } else if (typeof second === 'string' && shouldForceIpv4(second)) {
      args[1] = '0.0.0.0';
    } else if (typeof second === 'number') {
      args.splice(1, 0, '0.0.0.0');
    }
  }

  return originalListen.apply(this, args);
};
