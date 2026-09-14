#!/usr/bin/env bash
# Serve Tonight on IPv4 0.0.0.0:8081 so Cursor Browser can port-forward it.
set -euo pipefail

cd "$(dirname "$0")/.."

export BROWSER="${BROWSER:-none}"
export EXPO_NO_TELEMETRY="${EXPO_NO_TELEMETRY:-1}"

PATCH="$(pwd)/scripts/force-ipv4-listen.cjs"
if [[ -f "$PATCH" ]]; then
  export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--require ${PATCH}"
fi

exec npx expo start --web --lan --port 8081
