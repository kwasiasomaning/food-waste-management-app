'use strict';

const http = require('node:http');
const net = require('node:net');
const { once } = require('node:events');
const { spawn } = require('node:child_process');
const path = require('node:path');

require('./force-ipv4-listen.cjs');

function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        res.resume();
        res.on('end', () => resolve(res.statusCode));
      })
      .on('error', reject);
  });
}

function listenHttp() {
  const server = http.createServer((_req, res) => {
    res.end('ok');
  });
  server.listen(0, '127.0.0.1');
  return once(server, 'listening').then(() => server);
}

(async () => {
  const patched = await listenHttp();
  const { port } = patched.address();
  try {
    const ipv4 = await get(`http://127.0.0.1:${port}/`);
    if (ipv4 !== 200) throw new Error(`patched ipv4 expected 200, got ${ipv4}`);
    let ipv6Failed = false;
    try {
      await get(`http://[::1]:${port}/`);
    } catch {
      ipv6Failed = true;
    }
    if (!ipv6Failed) {
      throw new Error('expected ::1 to refuse before the proxy is running');
    }
  } finally {
    patched.close();
  }

  const upstream = await listenHttp();
  const proxyPort = upstream.address().port;
  const proxy = spawn(process.execPath, [path.join(__dirname, 'ipv6-loopback-proxy.cjs')], {
    env: { ...process.env, EXPO_PORT: String(proxyPort) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('proxy did not start')), 3000);
    proxy.stdout.on('data', (chunk) => {
      if (String(chunk).includes('[::1]')) {
        clearTimeout(timer);
        resolve();
      }
    });
    proxy.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`proxy exited ${code}: ${proxy.stderr.read() || ''}`));
    });
  });
  try {
    const proxied = await get(`http://[::1]:${proxyPort}/`);
    if (proxied !== 200) throw new Error(`proxied ipv6 expected 200, got ${proxied}`);
    const stillIpv4 = await get(`http://127.0.0.1:${proxyPort}/`);
    if (stillIpv4 !== 200) throw new Error(`ipv4 after proxy expected 200, got ${stillIpv4}`);
  } finally {
    proxy.kill('SIGTERM');
    upstream.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
