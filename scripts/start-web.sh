#!/usr/bin/env bash
# Serve Tonight on IPv4 0.0.0.0:18765, plus ::1 so Cursor Browser can connect.
set -euo pipefail

cd "$(dirname "$0")/.."

export BROWSER="${BROWSER:-none}"
export EXPO_NO_TELEMETRY="${EXPO_NO_TELEMETRY:-1}"
export EXPO_PORT="${EXPO_PORT:-18765}"

PATCH="$(pwd)/scripts/force-ipv4-listen.cjs"
if [[ -f "$PATCH" ]]; then
  export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--require ${PATCH}"
fi

npx expo start --web --lan --port "$EXPO_PORT" &
EXPO_PID=$!

cleanup() {
  kill "$EXPO_PID" 2>/dev/null || true
  if [[ -n "${PROXY_PID:-}" ]]; then
    kill "$PROXY_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

for _ in $(seq 1 60); do
  code="$(curl -4 -sS -o /dev/null -w '%{http_code}' --max-time 1 "http://127.0.0.1:${EXPO_PORT}/" 2>/dev/null || true)"
  if [[ "$code" == "200" ]]; then
    break
  fi
  sleep 0.5
done

PROXY="$(pwd)/scripts/ipv6-loopback-proxy.cjs"
if [[ -f "$PROXY" ]]; then
  # Do not inherit the IPv4 listen patch — it would steal 0.0.0.0:$EXPO_PORT.
  NODE_OPTIONS= EXPO_PORT="$EXPO_PORT" node "$PROXY" &
  PROXY_PID=$!
fi

wait "$EXPO_PID"
