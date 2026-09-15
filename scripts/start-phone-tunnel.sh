#!/usr/bin/env bash
# Publish Tonight web as a public HTTPS URL so a real phone can open it.
# Cursor only forwards 18765 to the desktop running Cursor, not to a phone.
set -euo pipefail

cd "$(dirname "$0")/.."

PORT="${EXPO_PORT:-18765}"
BIN_DIR="${TONIGHT_CLOUDFLARED_DIR:-$HOME/.cache/tonight}"
BIN="$BIN_DIR/cloudflared"
URL_FILE="${TONIGHT_PHONE_URL_FILE:-/tmp/tonight-phone-url.txt}"
LOG="${TONIGHT_PHONE_TUNNEL_LOG:-/tmp/tonight-phone-tunnel.log}"
ORIGIN="http://127.0.0.1:${PORT}"

mkdir -p "$BIN_DIR"

if [[ ! -x "$BIN" ]]; then
  echo "Downloading cloudflared…"
  curl -fL --retry 4 --retry-all-errors --retry-delay 2 \
    -o "$BIN" \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  chmod +x "$BIN"
fi

echo "Waiting for Tonight at ${ORIGIN} …"
ready=""
for _ in $(seq 1 60); do
  code="$(curl -4 -sS -o /dev/null -w '%{http_code}' --max-time 1 "${ORIGIN}/" 2>/dev/null || true)"
  if [[ "$code" == "200" ]]; then
    ready=1
    break
  fi
  sleep 0.5
done

if [[ -z "$ready" ]]; then
  echo "Tonight is not serving on port ${PORT}. Start it with ./scripts/start-web.sh first." >&2
  exit 1
fi

# Drop a previous quick tunnel for this origin so we do not leak a dead URL.
pkill -f "cloudflared tunnel --url ${ORIGIN}" 2>/dev/null || true
sleep 0.3

rm -f "$URL_FILE"
: > "$LOG"

echo "Opening a public HTTPS tunnel (trycloudflare)…"
"$BIN" tunnel --url "$ORIGIN" --protocol http2 --no-autoupdate >>"$LOG" 2>&1 &
CF_PID=$!

url=""
for _ in $(seq 1 50); do
  if ! kill -0 "$CF_PID" 2>/dev/null; then
    echo "cloudflared exited before advertising a URL. Last log lines:" >&2
    tail -n 40 "$LOG" >&2
    exit 1
  fi
  url="$(grep -Eo 'https://[A-Za-z0-9.-]+\.trycloudflare\.com' "$LOG" | head -n 1 || true)"
  if [[ -n "$url" ]]; then
    printf '%s\n' "$url" > "$URL_FILE"
    break
  fi
  sleep 0.4
done

if [[ -z "$url" ]]; then
  echo "Timed out waiting for a trycloudflare URL. Log: ${LOG}" >&2
  tail -n 40 "$LOG" >&2
  kill "$CF_PID" 2>/dev/null || true
  exit 1
fi

echo
echo "Phone URL (HTTPS): ${url}"
echo "Saved to ${URL_FILE}"
echo "Keep this process running. The hostname changes if the tunnel restarts."
echo

wait "$CF_PID"
