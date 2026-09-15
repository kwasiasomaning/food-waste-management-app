'use strict';

/**
 * Expo is bound to IPv4 0.0.0.0 on EXPO_PORT (8099 by default). Cursor Browser
 * often hits ::1 first (localhost resolves IPv6 first) and gets ERR_CONNECTION_REFUSED.
 * Forward IPv6 loopback to IPv4 loopback on the same port.
 */
const net = require('net');

const port = Number(process.env.EXPO_PORT || process.env.PORT || 8099);
const target = { host: '127.0.0.1', port };

const server = net.createServer((client) => {
  const upstream = net.connect(target, () => {
    client.pipe(upstream);
    upstream.pipe(client);
  });
  const close = () => {
    client.destroy();
    upstream.destroy();
  };
  client.on('error', close);
  upstream.on('error', close);
});

server.on('error', (error) => {
  console.error(`[ipv6-loopback-proxy] ${error.message}`);
  process.exit(1);
});

server.listen({ port, host: '::1', ipv6Only: true }, () => {
  console.log(`[ipv6-loopback-proxy] [::1]:${port} -> 127.0.0.1:${port}`);
});
